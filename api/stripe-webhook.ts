
import { buffer } from 'micro';
import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

// Configuration Vercel : Désactivation du body parser automatique pour la vérification Stripe
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

/**
 * Fonction d'envoi d'email via SMTP Gmail
 */
async function sendConfirmationEmail(
  to: string,
  orderId: string,
  amount: number,
  currency: string
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_FROM,
      // Utiliser un "Mot de passe d'application" généré dans le compte Google
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  const formattedAmount = (amount / 100).toFixed(2);
  const currencySymbol = currency.toUpperCase() === 'EUR' ? '€' : 'CHF';

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #000; background-color: #fff;">
      <h1 style="font-style: italic; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; border-bottom: 4px solid #000; padding-bottom: 10px;">SARPHOTAR™</h1>
      <p style="font-size: 16px; font-weight: bold; margin-top: 30px;">Merci pour votre confiance.</p>
      <p style="font-size: 14px; line-height: 1.6;">Votre arsenal est en cours de préparation. Voici les détails de votre acquisition :</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #666;">Numéro de commande</p>
        <p style="margin: 5px 0 15px 0; font-family: monospace; font-size: 18px; font-weight: bold;">${orderId}</p>
        
        <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #666;">Montant total payé</p>
        <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">${formattedAmount} ${currencySymbol}</p>
      </div>

      <p style="font-size: 14px; line-height: 1.6;">Notre équipe logistique vous recontactera sous 24h avec les informations de suivi.</p>
      
      <div style="margin-top: 40px; border-top: 1px solid #eee; pt: 20px;">
        <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Signature Sarphotar</p>
        <p style="font-size: 10px; color: #999;">Réalisme et Qualité. Domination Tactique.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Sarphotar™" <${process.env.MAIL_FROM}>`,
    to: to,
    subject: `Confirmation de commande Sarphotar – ${orderId}`,
    html: htmlContent,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Traitement du paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_details?.email;
    const totalAmount = session.amount_total;
    const currency = session.currency || 'eur';
    
    // Récupération de l'ID métier généré lors de la création de session
    // On utilise soit le metadata, soit on en génère un nouveau si manquant
    const orderId = session.metadata?.orderNumber || `SAR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (customerEmail && totalAmount) {
      try {
        await sendConfirmationEmail(customerEmail, orderId, totalAmount, currency);
        console.log(`✅ Email envoyé avec succès à ${customerEmail} pour la commande ${orderId}`);
      } catch (mailError) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', mailError);
        // On ne retourne pas d'erreur 500 à Stripe pour éviter les retries infinis si seul l'email échoue
      }
    }
  }

  res.status(200).json({ received: true });
}
