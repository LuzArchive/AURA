import { Router } from 'express';
import Groq     from 'groq-sdk';
import process  from 'node:process';
import Student  from '../models/Student.model.js';
import jwt      from 'jsonwebtoken';

const router = Router();

// ── Personalidades por arquetipo ──────────────────────────────────────────────
const ARCHETYPE_PERSONALITY = {
  analitico: `
PERSONALIDAD DEL AGENTE — ANALÍTICO (Ocelote / Azul Obsidiana):
- Tono: objetivo, intelectual, preciso y neutral. Sin adornos emocionales.
- Responde con datos concretos, referencias y modelos lógicos cuando sea posible.
- Velocidad: rápido en conceptos básicos, profundiza en debates lógicos complejos.
- Usa viñetas, estructura clara. Evita el uso excesivo de emojis.
- Si el estudiante hace una pregunta vaga, pide precisión antes de responder.`,

  centinela: `
PERSONALIDAD DEL AGENTE — CENTINELA (Ajolote / Verde Maguey):
- Tono: formal, estructurado, confiable y directo.
- Da instrucciones paso a paso, listas ordenadas y ejemplos concretos.
- Recuerda plazos proactivamente: si hay sesiones o trámites próximos, mencionarlos.
- Ritmo secuencial: no saltes de tema sin confirmar que el estudiante entendió el anterior.
- Usa checkmarks ✓ y numeración para estructurar respuestas.`,

  explorador: `
PERSONALIDAD DEL AGENTE — EXPLORADOR (Xoloitzcuintle / Naranja Cempasúchil):
- Tono: enérgico, casual, directo y estimulante.
- Ve directo a la utilidad práctica: empieza con "Esto sirve para X".
- Respuestas cortas y muy interactivas. Usa ejemplos rápidos y concretos.
- Puedes usar emojis con moderación para dar energía.
- Si el estudiante parece aburrido o desconectado, propón un mini reto o pregunta práctica.`,

  diplomatico: `
PERSONALIDAD DEL AGENTE — DIPLOMÁTICO (Tlacuache / Rosa Mexicano Terroso):
- Tono: cálido, cercano, motivador y empático. Valida emociones antes de dar información.
- Usa lenguaje positivo y refuerzo ante el estrés académico.
- Conecta los temas con su impacto en las personas o en la sociedad.
- Ritmo conversacional: da espacio para que el estudiante exprese cómo se siente.
- Usa analogías y metáforas para explicar conceptos abstractos.`,
};

// ── GET /api/chat/test ────────────────────────────────────────────────────────
router.get('/test', (_req, res) => {
  const key   = process.env.GROQ_API_KEY;
  const keyOk = !!key && key.length > 10;
  res.json({
    message: 'Ruta de chat funcionando',
    modelo:  process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
    api_key: keyOk ? '✅ configurada' : '❌ FALTA – revisa .env',
  });
});

// ── POST /api/chat ────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  console.log('[chat] petición recibida');

  const GROQ_API_KEY = (process.env.GROQ_API_KEY || '').trim();
  const GROQ_MODEL   = (process.env.GROQ_MODEL   || 'llama-3.1-8b-instant').trim();

  if (GROQ_API_KEY.length < 10) {
    return res.status(500).json({ error: 'El servidor no tiene configurada la API key.' });
  }

  const { messages, system } = req.body;
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ error: 'El campo "messages" debe ser un arreglo no vacío.' });

  // ── Intentar leer arquetipo del token JWT (opcional) ──────────────────────
  let archetypePersonality = '';
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token   = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id) {
        const student = await Student.findById(decoded.id, 'archetype name');
        if (student?.archetype && ARCHETYPE_PERSONALITY[student.archetype]) {
          archetypePersonality = ARCHETYPE_PERSONALITY[student.archetype];
        }
      }
    }
  } catch {
    // Token inválido o sin token — continúa sin personalidad adaptativa
  }

  // ── Construir mensajes ────────────────────────────────────────────────────
  const formattedMessages = [];

  // Inyectar personalidad del arquetipo al inicio del system prompt
  const fullSystem = archetypePersonality
    ? `${archetypePersonality}\n\n---\n\n${system || ''}`
    : (system || '');

  if (fullSystem) formattedMessages.push({ role: 'system', content: fullSystem });
  for (const m of messages) formattedMessages.push({ role: m.role, content: m.content });

  console.log(`[chat] arquetipo detectado: ${archetypePersonality ? 'sí' : 'ninguno'}`);
  console.log(`[chat] enviando a Groq (${GROQ_MODEL}), mensajes: ${formattedMessages.length}`);

  try {
    const groq   = new Groq({ apiKey: GROQ_API_KEY });
    const result = await groq.chat.completions.create({
      model:       GROQ_MODEL,
      messages:    formattedMessages,
      temperature: 0.7,
      max_tokens:  1024,
    });

    const text = result.choices?.[0]?.message?.content;
    if (!text) {
      return res.status(200).json({
        content: [{ text: '⚠️ No se generó respuesta. Intenta reformular tu pregunta.' }],
      });
    }

    return res.status(200).json({ content: [{ text }] });

  } catch (err) {
    console.error('[chat] Error:', err.message);
    const status   = err.status ?? err.statusCode ?? 500;
    const friendly = {
      401: 'API key inválida. Verifica GROQ_API_KEY en .env',
      403: 'Sin permiso para usar este modelo.',
      429: 'Se alcanzó el límite de uso. Espera un momento e intenta de nuevo.',
      500: 'Error interno del servicio. Intenta más tarde.',
      503: 'Servicio no disponible temporalmente.',
    };
    return res.status(status >= 400 ? status : 500).json({
      error: friendly[status] || err.message || 'Error al procesar la solicitud.',
    });
  }
});

export default router;
