import ComplementaryRelease from '../models/ComplementaryRelease.model.js';
import Credit               from '../models/Credit.model.js';
import { updateStudentComplementaryCredit } from './coordinator.controller.js';

// ── POST /api/releases ────────────────────────────────────────────────────────
export const submitRelease = async (req, res) => {
  // imageBase64: base64 of the image (PNG/JPG converted from PDF on frontend)
  // imageType:   MIME type — 'image/png' or 'image/jpeg'
  // pdfBase64:   original PDF base64 for storage (optional, can be same as imageBase64)
  const { activityType, pdfBase64, pdfName, imageBase64, imageType } = req.body;
  const studentId = req.user.id;

  // Accept either imageBase64 (new flow) or pdfBase64 (legacy)
  const fileData     = imageBase64 || pdfBase64;
  const fileMimeType = imageType   || 'image/png';

  if (!activityType || !fileData)
    return res.status(400).json({ message: 'activityType e imageBase64 son requeridos' });

  const validTypes = ['academico', 'fisico', 'cultural', 'escolar'];
  if (!validTypes.includes(activityType))
    return res.status(400).json({ message: `activityType debe ser: ${validTypes.join(', ')}` });

  try {
    const existing = await ComplementaryRelease.findOne({
      student: studentId,
      activityType,
      status: { $in: ['pending', 'approved'] },
    });
    if (existing)
      return res.status(409).json({ message: `Ya tienes una carta de tipo "${activityType}" enviada o aprobada.` });

    // ── AI Verification ───────────────────────────────────────────────────────
    const aiResult = await verifyPDFWithAI(fileData, fileMimeType, req.user);

    const release = await ComplementaryRelease.create({
      student:       studentId,
      activityType,
      pdfBase64:     pdfBase64 || imageBase64,   // store whatever was provided
      pdfName:       pdfName || 'carta_liberacion.png',
      extractedData: aiResult.extractedData,
      aiVerification: {
        valid:       aiResult.valid,
        confidence:  aiResult.confidence,
        issues:      aiResult.issues,
        rawResponse: aiResult.rawResponse,
      },
      status: aiResult.valid && aiResult.confidence >= 80 ? 'approved' : 'pending',
    });

    if (release.status === 'approved') {
      await updateStudentComplementaryCredit(studentId, activityType, 'aprobada');
    }

    res.status(201).json({
      release: { ...release.toObject(), pdfBase64: undefined },
      autoApproved: release.status === 'approved',
      aiVerification: {
        confidence: aiResult.confidence,
        issues:     aiResult.issues,
        seals:      aiResult.extractedData.seals,
      },
      message: release.status === 'approved'
        ? '✅ Carta verificada y crédito liberado automáticamente.'
        : '📋 Carta recibida. Está pendiente de revisión por el coordinador.',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/releases/me ──────────────────────────────────────────────────────
export const getMyReleases = async (req, res) => {
  try {
    const releases = await ComplementaryRelease
      .find({ student: req.user.id }, '-pdfBase64')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(releases);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── GET /api/releases/:id/pdf ─────────────────────────────────────────────────
export const getReleasePDF = async (req, res) => {
  try {
    const release = await ComplementaryRelease.findById(req.params.id);
    if (!release) return res.status(404).json({ message: 'No encontrado' });
    if (req.user.role === 'student' && !release.student.equals(req.user.id))
      return res.status(403).json({ message: 'Sin acceso' });
    res.json({ pdfBase64: release.pdfBase64, pdfName: release.pdfName });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─────────────────────────────────────────────────────────────────────────────
// AI VERIFICATION — Prompt específico para la carta real del TecNM Apizaco
//
// Estructura real de la carta:
// - Logos: SEP + TecNM en encabezado
// - Emitida por: jefe del área que realizó la actividad (ej. Centro de Información)
// - Dirigida a: Jefa del Depto. de Servicios Escolares
// - Cuerpo: nombre alumno, no. control, actividad, período, créditos, carrera
// - Firma: nombre y cargo del jefe del área emisora
//
// 3 SELLOS OBLIGATORIOS (deben aparecer los 3 para ser válida):
//   1. "RECIBIDO — DEPARTAMENTO DE SISTEMAS Y COMPUTACIÓN"
//   2. "RECIBIDO — DEPARTAMENTO DE SERVICIOS ESCOLARES"
//   3. Sello/logo de "CENTRO DE INFORMACIÓN" (u otra área emisora)
// ─────────────────────────────────────────────────────────────────────────────
const verifyPDFWithAI = async (imageBase64, imageType, user) => {
  // Uses Groq API — receives image converted from PDF on the frontend
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  const systemPrompt = `Eres un verificador experto de documentos oficiales del Tecnológico Nacional de México (TecNM), Campus Apizaco.
Analizas cartas de liberación de actividades complementarias y verificas su autenticidad.
REGLA CRÍTICA: Responde ÚNICAMENTE con JSON válido. Sin texto adicional, sin markdown, sin explicaciones fuera del JSON.`;

  const userPrompt = `Analiza esta carta de liberación de actividad complementaria del Instituto Tecnológico de Apizaco (TecNM).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA ESPERADA DEL DOCUMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
El documento es una carta oficial que debe contener:

ENCABEZADO:
- Logos institucionales: SEP (Secretaría de Educación Pública) y TecNM (Tecnológico Nacional de México)
- Membrete del área emisora (ej: "Centro de Información", "Deportes", "Cultura")

DATOS DEL OFICIO:
- Lugar y fecha (ej: "Apizaco, Tlaxcala, 21/agosto/2023")
- Número de oficio (ej: "OFICIO No. C.I./082/2023")
- Asunto: Entrega Lista de Liberaciones

DESTINATARIO:
- Nombre y cargo de quien recibe (generalmente Jefa del Depto. de Servicios Escolares)

CUERPO DEL TEXTO — debe mencionar explícitamente:
- Nombre completo del alumno/a
- Número de control del alumno (8 dígitos)
- Nombre de la actividad complementaria realizada
- Período de realización (ej: "enero-junio 2023")
- Valor: "1 crédito"
- Carrera del alumno

FIRMA:
- Nombre del jefe/jefa del área que emite la carta
- Cargo del firmante

3 SELLOS OBLIGATORIOS (MUY IMPORTANTE — busca estos sellos físicos en el documento):
  SELLO 1: Sello con texto "RECIBIDO" + "DEPARTAMENTO DE SISTEMAS Y COMPUTACIÓN"
           (puede incluir fecha y rúbrica)
  SELLO 2: Sello con texto "RECIBIDO" + "DEPARTAMENTO DE SERVICIOS ESCOLARES"  
           (puede incluir fecha y rúbrica)
  SELLO 3: Logo o sello del "CENTRO DE INFORMACIÓN" u otra área emisora del TecNM Apizaco
           (con escudo de la SEP/TecNM)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATOS A EXTRAER Y VALIDAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Extrae los siguientes campos y devuelve SOLO este JSON:

{
  "studentName": "nombre completo del alumno mencionado en el cuerpo",
  "controlNumber": "número de control de 8 dígitos",
  "signerName": "nombre del jefe/jefa que firma la carta",
  "signerTitle": "cargo del firmante (ej: JEFA DEL CENTRO DE INFORMACIÓN)",
  "activityName": "nombre exacto de la actividad complementaria",
  "activityType": "clasifica como: academico | fisico | cultural | escolar",
  "period": "período de realización (ej: enero-junio 2023)",
  "credits": 1,
  "career": "carrera del alumno mencionada",
  "officeNumber": "número de oficio si aparece",
  "date": "fecha del documento",
  "issuingDepartment": "departamento o área que emite la carta",
  "seals": {
    "sistemasYComputacion": false,
    "serviciosEscolares": false,
    "centroInformacionUAreaEmisora": false
  },
  "hasLogosInstitucionales": false,
  "hasSignatureOrRubric": false,
  "isOfficialTecNMDocument": false,
  "missingFields": [],
  "issues": [],
  "confidence": 0
}

REGLAS PARA confidence (0-100):
- Comienza en 100
- Resta 25 si falta el sello de Sistemas y Computación
- Resta 25 si falta el sello de Servicios Escolares
- Resta 15 si falta el sello/logo del área emisora
- Resta 20 si no hay nombre de alumno legible
- Resta 20 si no hay número de control
- Resta 10 si no hay firma o rúbrica
- Resta 10 si no hay logos institucionales SEP/TecNM
- Resta 15 si el documento no parece oficial del TecNM Apizaco

REGLAS para issues: lista los problemas encontrados como strings.
Ejemplos: "Falta sello del Depto. de Sistemas y Computación", "No se detectó número de control"

CLASIFICACIÓN de activityType:
- academico: círculo de lectura, taller académico, conferencia académica, biblioteca
- fisico: fútbol, voleibol, basquetbol, atletismo, ajedrez, acondicionamiento físico, beisbol
- cultural: danza, artes plásticas, teatro, música, danza folklórica
- escolar: semana de ingeniería, eventos institucionales, apoyo en eventos escolares`;

  try {
    // Groq API — receives image (PNG/JPG converted from PDF on the frontend)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:       'meta-llama/llama-4-scout-17b-16e-instruct',
        max_tokens:  1200,
        temperature: 0.1,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              {
                type: 'image_url',
                image_url: {
                  // imageBase64 and imageType are sent from the frontend
                  // imageType is 'image/png' or 'image/jpeg'
                  url: `data:${imageType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const raw  = data.choices?.[0]?.message?.content || '{}';

    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      return {
        valid:        false,
        confidence:   0,
        issues:       ['No se pudo analizar la respuesta de la IA'],
        rawResponse:  raw,
        extractedData: _emptyExtracted(),
      };
    }

    // ── Cross-validate name and control number against logged-in student ──────
    const firstName    = user.name?.split(' ')[0]?.toLowerCase() || '';
    const lastName     = user.name?.split(' ')[1]?.toLowerCase() || '';
    const extractedLow = (parsed.studentName || '').toLowerCase();

    const nameMatch    = extractedLow.includes(firstName) || extractedLow.includes(lastName);
    const controlMatch = (parsed.controlNumber || '').replace(/\s/g, '') === (user.controlNumber || '');

    if (!nameMatch) {
      parsed.issues = [...(parsed.issues || []), `El nombre en la carta ("${parsed.studentName}") no coincide con el estudiante registrado ("${user.name}")`];
      parsed.confidence = Math.max(0, (parsed.confidence || 0) - 35);
    }
    if (!controlMatch) {
      parsed.issues = [...(parsed.issues || []), `El número de control en la carta ("${parsed.controlNumber}") no coincide con el registrado ("${user.controlNumber}")`];
      parsed.confidence = Math.max(0, (parsed.confidence || 0) - 35);
    }

    // ── Seal-specific issue messages ──────────────────────────────────────────
    const seals = parsed.seals || {};
    if (!seals.sistemasYComputacion)
      parsed.issues = [...(parsed.issues || []), 'Falta sello: RECIBIDO — Departamento de Sistemas y Computación'];
    if (!seals.serviciosEscolares)
      parsed.issues = [...(parsed.issues || []), 'Falta sello: RECIBIDO — Departamento de Servicios Escolares'];
    if (!seals.centroInformacionUAreaEmisora)
      parsed.issues = [...(parsed.issues || []), 'Falta sello o logo del área emisora (Centro de Información u otro departamento)'];

    const confidence = Math.max(0, Math.min(100, parsed.confidence || 0));
    const allSealsOk = seals.sistemasYComputacion && seals.serviciosEscolares && seals.centroInformacionUAreaEmisora;
    const valid      = confidence >= 80 && allSealsOk && nameMatch && controlMatch && (parsed.issues?.length === 0);

    return {
      valid,
      confidence,
      issues:      parsed.issues       || [],
      rawResponse: raw,
      extractedData: {
        studentName:   parsed.studentName   || '',
        controlNumber: parsed.controlNumber || '',
        signerName:    parsed.signerName    || '',
        signerTitle:   parsed.signerTitle   || '',
        activityName:  parsed.activityName  || '',
        activityType:  parsed.activityType  || '',
        period:        parsed.period        || '',
        career:        parsed.career        || '',
        date:          parsed.date          || '',
        officeNumber:  parsed.officeNumber  || '',
        issuingDepartment: parsed.issuingDepartment || '',
        hasLogosTecNM: parsed.hasLogosInstitucionales || false,
        seals: {
          sistemasYComputacion:        seals.sistemasYComputacion        || false,
          serviciosEscolares:           seals.serviciosEscolares           || false,
          centroInformacionUAreaEmisora:seals.centroInformacionUAreaEmisora || false,
        },
      },
    };
  } catch (err) {
    return {
      valid:        false,
      confidence:   0,
      issues:       [`Error al conectar con el servicio de IA: ${err.message}`],
      rawResponse:  '',
      extractedData: _emptyExtracted(),
    };
  }
};

const _emptyExtracted = () => ({
  studentName: '', controlNumber: '', signerName: '', signerTitle: '',
  activityName: '', activityType: '', period: '', career: '', date: '',
  officeNumber: '', issuingDepartment: '', hasLogosTecNM: false,
  seals: { sistemasYComputacion: false, serviciosEscolares: false, centroInformacionUAreaEmisora: false },
});
