import express from 'express'
import { authenticate } from '../middlewares/auth.js';
import { getMe,getFavorites,getMyListings } from '../controllers/users.js';

const router = express.Router()

router.get('/me', authenticate, getMe)
router.get('/favorites', authenticate, getFavorites)
router.get('/listings', authenticate, getMyListings)

export default router;
