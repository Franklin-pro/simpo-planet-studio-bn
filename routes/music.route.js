import express from 'express';
import { createMusic, deleteMusic, getMusic, getMusicById, updateMusic,incrementPlayCount } from '../controllers/music.controller.js';

const router = express.Router();

// Route to create a new music entry
router.post('/', createMusic);
// Route to get all music entries
router.get('/', getMusic);
// Route to get a music entry by ID
router.get('/:id', getMusicById);
// Route to update a music entry
router.put('/:id', updateMusic);
// Route to delete a music entry
router.delete('/:id', deleteMusic);
// Route to increment play count
router.put('/:id/play', incrementPlayCount);

export default router;