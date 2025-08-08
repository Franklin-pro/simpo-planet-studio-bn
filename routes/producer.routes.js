import express from 'express';
import { getProducers, createProducer, getProducerById, updateProducer, deleteProducer } from '../controllers/producers.controller.js';


const router = express.Router();


router.get('/', getProducers);
router.post('/', createProducer);
router.get('/:id', getProducerById);
router.put('/:id', updateProducer);
router.delete('/:id',deleteProducer);

export default router;