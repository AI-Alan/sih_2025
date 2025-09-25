import express from 'express';
import { health } from '../controller/chatbotController.js';

const router = express.Router();

// Public health proxy to FastAPI service
router.get('/health', health);

export default router;
