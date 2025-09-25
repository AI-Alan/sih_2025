import { chatbotHealth } from '../services/chatbotClient.js';

export const health = async (req, res) => {
  try {
    const data = await chatbotHealth();
    return res.json({ ok: true, upstream: data });
  } catch (err) {
    const status = err?.response?.status || 500;
    return res.status(status).json({ ok: false, error: err?.message || 'Upstream not reachable' });
  }
};
