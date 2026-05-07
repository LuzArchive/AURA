import express from 'express';
import Groq     from 'groq-sdk';
import process  from 'node:process';

const router = express.Router();

// ── Test — GET /api/chat/test ─────────────────────────────────────────────────
router.get('/test', (_req, res) => {
  const key   = process.env.GROQ_API_KEY;
  const keyOk = !!key && key.length > 10;
  res.json({
    message: 'Ruta de chat funcionando',
    modelo:  process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
    api_key: keyOk ? '✅ configurada' : '❌ FALTA – revisa .env',
  });
});

// ── POST /api/chat  ←── cambiado de '/chat' a '/'  ───────────────────────────
router.post('/', async (req, res) => {
  console.log('[chat] petición recibida');

  const GROQ_API_KEY = (process.env.GROQ_API_KEY || '').trim();
  const GROQ_MODEL   = (process.env.GROQ_MODEL   || 'llama-3.1-8b-instant').trim();

  if (GROQ_API_KEY.length < 10) {
    console.error('[chat] GROQ_API_KEY no configurada');
    return res.status(500).json({
      error: 'El servidor no tiene configurada la API key. Contacta al administrador.',
    });
  }

  const { messages, system } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'El campo "messages" debe ser un arreglo no vacío.' });
  }

  const formattedMessages = [];
  if (system) formattedMessages.push({ role: 'system', content: system });
  for (const m of messages) formattedMessages.push({ role: m.role, content: m.content });

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
      console.warn('[chat] Groq no devolvió texto');
      return res.status(200).json({
        content: [{ text: '⚠️ No se generó respuesta. Intenta reformular tu pregunta.' }],
      });
    }

    console.log('[chat] respuesta exitosa');
    return res.status(200).json({ content: [{ text }] });

  } catch (err) {
    console.error('[chat] Error:', err.message);
    const status = err.status ?? err.statusCode ?? 500;
    const friendly = {
      401: 'API key inválida. Verifica GROQ_API_KEY en .env',
      403: 'Sin permiso para usar este modelo.',
      429: 'Se alcanzó el límite de uso. Espera un momento e intenta de nuevo.',
      500: 'Error interno del servicio. Intenta más tarde.',
      503: 'Servicio no disponible temporalmente. Intenta más tarde.',
    };
    return res.status(status >= 400 ? status : 500).json({
      error: friendly[status] || err.message || 'Error al procesar la solicitud.',
    });
  }
});

export default router;
