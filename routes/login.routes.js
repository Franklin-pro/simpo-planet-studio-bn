import express from 'express';
import { createAccount, login, getAllUsers } from '../controllers/admin.cotroller.js';

const router = express.Router();
router.post('/create', createAccount);
router.post('/login', login);
router.get('/users', getAllUsers);

export default router;