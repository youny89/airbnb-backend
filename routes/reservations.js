import express from 'express'
import { authenticate } from '../middlewares/auth.js';

import { cancelReservation, createReservation, getReservations } from '../controllers/reservation.js'

const router = express();

router.post('/', authenticate, createReservation)
router.delete('/:id', authenticate, cancelReservation)
router.get('/', getReservations)

export default router;