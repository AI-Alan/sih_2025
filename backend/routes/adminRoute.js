// backend/routes/adminRoute.js
import express from 'express';
const router = express.Router();

import {
    registerValidator,
    counsellorCreateValidator,
    counsellorUpdateValidator,
} from '../middleware/validator.js';

import {
    getAllUser,
    updateUser,
    deleteUser,
    getAllCounsellor,
    createCounsellor,
    updateCounsellor,
    deleteCounsellor,
} from '../controller/adminController.js';

import jwtAuth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';

// Require auth and admin role for everything in /api/admin/*
router.use(jwtAuth);
router.use(isAdmin);

// Users
router.get('/user', getAllUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

// Counsellors
router.get('/counsellor', getAllCounsellor);
router.post('/counsellor', counsellorCreateValidator, createCounsellor);
router.put('/counsellor/:id', counsellorUpdateValidator, updateCounsellor);
router.delete('/counsellor/:id', deleteCounsellor);

export default router;