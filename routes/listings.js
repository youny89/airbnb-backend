import express from 'express'
import {
    createList,
    getLists,
    getListDetail,
    addFavorite,
    removeFavorite,
    removeList } from '../controllers/listing.js';

import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/',authenticate,createList);
router.post('/favorite/:id', authenticate, addFavorite)
router.delete('/favorite/:id', authenticate, removeFavorite)
router.get('/', getLists);
router.get('/:id', getListDetail);
router.delete('/:id', authenticate,removeList);

export default router;