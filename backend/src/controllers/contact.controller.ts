// src/controllers/contact.controller.ts
import { Request, Response } from 'express';
import ContactMessage from '../models/ContactMessage.model.js';

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation simple
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis',
      });
    }

    const contact = await ContactMessage.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
    });

    res.status(201).json({
      success: true,
      message: 'Message reçu ! Nous vous répondrons très bientôt.',
      contactId: contact._id,
    });
  } catch (err: any) {
    console.error('Erreur submitContact:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement du message',
    });
  }
};