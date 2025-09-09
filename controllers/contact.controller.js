import Contact from "../models/contact.model.js";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Message</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">📧 New Contact Message</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">You have received a new message from your website</p>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                        <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Contact Details</h3>
                        <table width="100%" cellpadding="8" cellspacing="0">
                          <tr>
                            <td style="color: #666; font-weight: bold; width: 80px;">👤 Name:</td>
                            <td style="color: #333;">${name}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-weight: bold;">📧 Email:</td>
                            <td style="color: #333;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-weight: bold;">📱 Phone:</td>
                            <td style="color: #333;"><a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a></td>
                          </tr>
                        </table>
                      </div>
                      
                      <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px;">
                        <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">💬 Message</h3>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #667eea;">
                          <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                        </div>
                      </div>
                      
                      <div style="text-align: center; margin-top: 30px;">
                        <a href="mailto:${email}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Reply to ${name}</a>
                      </div>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                      <p style="color: #666; margin: 0; font-size: 14px;">📅 Received on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      <p style="color: #999; margin: 5px 0 0 0; font-size: 12px;">This message was sent from your website contact form</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

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
