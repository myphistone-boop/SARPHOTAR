
import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // On récupère l'email de destination via la query string ou on utilise le MAIL_FROM par défaut
  const targetEmail = (req.query.to as string) || process.env.MAIL_FROM;

  if (!process.env.MAIL_FROM || !process.env.MAIL_APP_PASSWORD) {
    return res.status(500).json({ 
      error: "Variables d'environnement manquantes (MAIL_FROM ou MAIL_APP_PASSWORD)." 
    });
  }

  const orderId = `SAR-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
  const amount = 2999; // 29.99
  const currency = 'CHF';

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_APP_PASSWORD,
      },
    });

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #000; background-color: #fff;">
        <h1 style="font-style: italic; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; border-bottom: 4px solid #000; padding-bottom: 10px;">SARPHOTAR™ (TEST)</h1>
        <p style="font-size: 16px; font-weight: bold; margin-top: 30px;">Ceci est un test de configuration.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #666;">Numéro de commande fictif</p>
          <p style="margin: 5px 0 15px 0; font-family: monospace; font-size: 18px; font-weight: bold;">${orderId}</p>
          
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #666;">Montant de test</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">29.99 CHF</p>
        </div>

        <p style="font-size: 14px; line-height: 1.6;">Si vous recevez ce mail, votre configuration SMTP est opérationnelle pour le webhook Stripe.</p>
        
        <div style="margin-top: 40px; border-top: 1px solid #eee; pt: 20px;">
          <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Ingénierie Sarphotar</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Sarphotar Test" <${process.env.MAIL_FROM}>`,
      to: targetEmail,
      subject: `[TEST] Confirmation de commande Sarphotar – ${orderId}`,
      html: htmlContent,
    });

    return res.status(200).json({ 
      success: true, 
      message: `Email de test envoyé à ${targetEmail}`,
      messageId: info.messageId 
    });

  } catch (error: any) {
    console.error('Erreur Test Email:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      hint: "Vérifiez que le 'Mot de passe d'application' Gmail est correct et que l'accès SMTP n'est pas bloqué."
    });
  }
}
