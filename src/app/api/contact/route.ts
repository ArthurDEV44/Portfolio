import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialiser Resend avec une clé API (vous devrez l'ajouter dans vos variables d'environnement)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, workEmail, subject, message } = body;



    // Validation des champs requis
    if (!firstName || !lastName || !workEmail || !subject || !message) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Tous les champs sont requis' 
        },
        { status: 400 }
      );
    }

    // Validation des longueurs minimales (pour correspondre au client)
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Le prénom et le nom doivent contenir au moins 2 caractères' 
        },
        { status: 400 }
      );
    }

    if (subject.trim().length < 5) {
      return NextResponse.json(
        { 
          success: false,
          message: 'L\'objet doit contenir au moins 5 caractères' 
        },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Le message doit contenir au moins 10 caractères' 
        },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(workEmail.trim())) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Veuillez entrer une adresse email valide' 
        },
        { status: 400 }
      );
    }

    // Nettoyer les données (trimmer les espaces)
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanWorkEmail = workEmail.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();
    const fullName = `${cleanFirstName} ${cleanLastName}`;

    // Créer le contenu de l'email
    const emailContent = `
Nouvelle demande de contact depuis le portfolio Arthur Jean

--- INFORMATIONS CLIENT ---
Prénom: ${cleanFirstName}
Nom: ${cleanLastName}
Email: ${cleanWorkEmail}
Objet: ${cleanSubject}

--- MESSAGE ---
${cleanMessage}

--- DÉTAILS TECHNIQUES ---
Date: ${new Date().toLocaleString('fr-FR')}
IP: ${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Non disponible'}
User-Agent: ${request.headers.get('user-agent') || 'Non disponible'}
`;

    // Envoyer l'email
    const emailResponse = await resend.emails.send({
      from: 'onboarding@resend.dev', // Adresse d'expéditeur par défaut Resend (vous pourrez la changer avec votre domaine)
      to: 'arthur.jean@strivex.fr', // Votre adresse email où recevoir les messages
      subject: `[Portfolio] Nouvelle demande de contact - ${cleanSubject || 'Contact général'} - ${fullName}`,
      text: emailContent,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nouvelle demande de contact</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #333;">
          
          <div style="max-width: 580px; margin: 0 auto; padding: 40px 20px;">
            
            <!-- En-tête -->
            <div style="margin-bottom: 32px;">
              <div style="color: #000; font-size: 16px; font-weight: 500; margin-bottom: 4px;">
                Arthur Jean - Portfolio
              </div>
              <div style="color: #666; font-size: 14px;">
                arthur.jean@strivex.fr
              </div>
            </div>

            <!-- Titre principal -->
            <h1 style="color: #000; font-size: 24px; font-weight: 600; margin: 0 0 24px 0; line-height: 1.3;">
              Nouvelle demande de contact
            </h1>

            <!-- Message introductif -->
            <p style="color: #666; font-size: 16px; margin: 0 0 32px 0; line-height: 1.5;">
              Une nouvelle demande de contact a été soumise depuis votre <strong>portfolio</strong>.
            </p>

            <!-- Informations du contact -->
            <div style="margin-bottom: 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px; width: 120px; vertical-align: top;">
                    Prénom
                  </td>
                  <td style="padding: 8px 0; color: #000; font-size: 14px;">
                    ${cleanFirstName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">
                    Nom
                  </td>
                  <td style="padding: 8px 0; color: #000; font-size: 14px;">
                    ${cleanLastName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">
                    Email
                  </td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${cleanWorkEmail}" style="color: #000; text-decoration: none; font-size: 14px;">${cleanWorkEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">
                    Objet
                  </td>
                  <td style="padding: 8px 0; color: #000; font-size: 14px;">
                    ${cleanSubject}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">
                    Date
                  </td>
                  <td style="padding: 8px 0; color: #000; font-size: 14px;">
                    ${new Date().toLocaleString('fr-FR')}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Message -->
            <div style="margin-bottom: 32px;">
              <div style="color: #666; font-size: 14px; margin-bottom: 8px;">
                Message :
              </div>
              <div style="background-color: #f9f9f9; padding: 16px; border-radius: 4px; border-left: 3px solid #000; word-wrap: break-word; overflow-wrap: break-word;">
                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; max-width: 100%;">${cleanMessage}</p>
              </div>
            </div>

            <!-- Actions -->
            <div style="margin-bottom: 32px;">
              <a href="mailto:${cleanWorkEmail}" 
                 style="display: inline-block; background-color: #000; color: white; text-decoration: none; padding: 12px 20px; border-radius: 4px; font-size: 14px; font-weight: 500;">
                Répondre par email
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 40px;">
              <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                © 2025 Arthur Jean - Développeur Full Stack<br>
                <a href="https://arthurjean.dev" style="color: #000; text-decoration: none;">Portfolio</a>
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    });

    if (emailResponse.error) {
      console.error('Erreur Resend:', emailResponse.error);
      return NextResponse.json(
        { 
          success: false,
          message: 'Erreur lors de l\'envoi de l\'email' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.',
        emailId: emailResponse.data?.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'envoi du formulaire de contact:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Erreur interne du serveur' 
      },
      { status: 500 }
    );
  }
}