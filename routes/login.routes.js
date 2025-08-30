import express from 'express';
import { createAccount, login } from '../controllers/admin.cotroller.js';

const router = express.Router();
router.post('/create', createAccount);
router.post('/login', login);

export default router;