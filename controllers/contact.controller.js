import Contact from "../models/contact.model.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new contact
// @route   POST /api/v1/contact
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    message,
  });

  if (contact) {
    res.status(201).json({
      _id: contact._id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
    });
  } else {
    res.status(400);
    throw new Error("Invalid contact data");
  }
});
// @desc    Get all contacts
// @route   GET /api/v1/contact
// @access  Public
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({});
  res.json(contacts);
});
// @desc    Get a contact by ID
// @route   GET /api/v1/contact/:id
// @access  Public
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    res.json(contact);
  } else {
    res.status(404);
    throw new Error("Contact not found");
  }
});
// @desc    Update a contact
// @route   PUT /api/v1/contact/:id
// @access  Public
const updateContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (contact) {
    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;
    contact.message = message || contact.message;

    const updatedContact = await contact.save();
    res.json({
      _id: updatedContact._id,
      name: updatedContact.name,
      email: updatedContact.email,
      phone: updatedContact.phone,
      message: updatedContact.message,
    });
  } else {
    res.status(404);
    throw new Error("Contact not found");
  }
});
// @desc    Delete a contact
// @route   DELETE /api/v1/contact/:id
// @access  Public
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    await contact.remove();
    res.json({ message: "Contact removed" });
  } else {
    res.status(404);
    throw new Error("Contact not found");
  }
});
export {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};
