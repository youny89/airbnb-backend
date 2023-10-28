import express from 'express'
import { signin, signup } from '../controllers/auth.js'

const router = express.Router();

router.get('/signin', signin)
router.get('/signup', signup)

export default router;