// backend/services/chatbotClient.js
import axios from 'axios';

const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || 'http://localhost:8000';
const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY || '';

const instance = axios.create({
  baseURL: CHATBOT_SERVICE_URL,
  timeout: 10000,
});

export async function chatbotChat({ student_id, message, domain, update_profile }) {
  const headers = { 'Content-Type': 'application/json' };
  if (CHATBOT_API_KEY) headers['X-API-Key'] = CHATBOT_API_KEY;
  const res = await instance.post('/chat/', { student_id, message, domain, update_profile }, { headers });
  return res.data;
}

export async function chatbotHealth() {
  const res = await instance.get('/health/ping');
  return res.data;
}
