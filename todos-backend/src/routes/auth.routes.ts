import { Router } from 'express';
import { register, login, logout, getUser } from '../controllers/auth.controller';
import protectedRouter from '../utils/authorize';

const router = Router();

router.get('/user', protectedRouter, getUser);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
