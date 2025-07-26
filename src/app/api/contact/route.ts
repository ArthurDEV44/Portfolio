import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

// Schéma de validation pour les données de contact
const contactSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  workEmail: z.string().email('Veuillez entrer une adresse email valide'),
  subject: z.string().min(5, 'L\'objet doit contenir au moins 5 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données
    const validatedData = contactSchema.parse(body);
    
    // Enregistrement en base de données
    const contact = await prisma.contact.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        workEmail: validatedData.workEmail,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Votre message a été envoyé avec succès ! Je vous recontacterai rapidement.',
        id: contact.id 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Données invalides',
          errors: error.issues
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 