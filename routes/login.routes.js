import express from 'express';
import { createAccount, login, getAllUsers,logout } from '../controllers/admin.cotroller.js';

const router = express.Router();
router.post('/create', createAccount);
router.post('/login', login);
router.post('/logout', logout);
router.get('/users', getAllUsers);

export default router;