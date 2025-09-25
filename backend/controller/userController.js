export const peerChat = (req, res) => {
    res.send("peer to peer chat");
}

export const counsellorChat = (req, res) => {
    res.send("chat with counsellor")
}

import { chatbotChat } from '../services/chatbotClient.js';

export const aiChat = async (req, res) => {
    try {
        const userId = req.user?._id?.toString() || req.body.student_id || 'anonymous';
        const { message, domain, update_profile } = req.body || {};
        if (!message) {
            return res.status(400).json({ error: 'message is required' });
        }
        const data = await chatbotChat({
            student_id: userId,
            message,
            domain,
            update_profile,
        });
        return res.json(data);
    } catch (err) {
        console.error('AI chat error:', err?.response?.data || err.message);
        const status = err?.response?.status || 500;
        return res.status(status).json({ error: 'Failed to get AI response' });
    }
}