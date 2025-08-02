import express from 'express';
import { createContact,getContacts,getContactById,updateContact,deleteContact } from '../controllers/contact.controller.js';

const router = express.Router();

// Route to create a new contact
router.post('/', createContact);
// Route to get all contacts
router.get('/', getContacts);
// Route to get a contact by ID
router.get('/:id', getContactById);
// Route to update a contact
router.put('/:id', updateContact);
// Route to delete a contact
router.delete('/:id', deleteContact);
export default router;