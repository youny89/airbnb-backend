import express from 'express'
import { authenticate } from '../middlewares/auth.js';
import { getMe } from '../controllers/users.js';

const router = express.Router()

router.get('/me', authenticate, getMe)

export default router;
