import express from 'express';
import { getProducers, createProducer, getProducerById, updateProducer, deleteProducer } from '../controllers/producers.controller.js';


const router = express.Router();

router.post('/add-producer', createProducer);
router.get('/', getProducers);
router.get('/:id', getProducerById);
router.put('/:id', updateProducer);
router.delete('/:id',deleteProducer);

export default router;