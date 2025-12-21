
import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

/**
 * Cette fonction est une copie conforme de la logique de production 
 * pour garantir que le test est représentatif.
 */
async function sendConfirmationEmail(
  to: string,
  orderId: string,
  amount: number,
  currency: string,
  customerDetails: any,
  shippingDetails: any
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_FROM,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  const formattedAmount = (amount / 100).toFixed(2);
  const currencySymbol = currency.toUpperCase() === 'EUR' ? '€' : 'CHF';
  
  const addr = shippingDetails?.address || customerDetails?.address;
  const addressHtml = addr ? `
    ${addr.line1}${addr.line2 ? '<br/>' + addr.line2 : ''}<br/>
    ${addr.postal_code} ${addr.city}<br/>
    ${addr.country?.toUpperCase()}
  ` : 'Non renseignée';

  const customerName = shippingDetails?.name || customerDetails?.name || 'Client Sarphotar';
  const customerPhone = shippingDetails?.phone || customerDetails?.phone || 'Non renseigné';

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #000; background-color: #fff; border: 1px solid #eee;">
      <h1 style="font-style: italic; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; border-bottom: 4px solid #000; padding-bottom: 10px; margin-bottom: 30px;">SARPHOTAR™</h1>
      
      <p style="font-size: 16px; font-weight: bold;">Merci pour votre commande, ${customerName}.</p>
      <p style="font-size: 14px; line-height: 1.6; color: #333;">Votre arsenal est en cours de préparation. En raison d'une <strong>forte demande</strong>, nos équipes font le maximum pour expédier votre colis <strong>au plus vite</strong>.</p>
      
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 4px; margin: 25px 0;">
        <h2 style="font-size: 12px; text-transform: uppercase; color: #888; margin: 0 0 15px 0; letter-spacing: 1px;">Récapitulatif de commande</h2>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #666;">Numéro :</td>
            <td style="padding: 5px 0; font-weight: bold; font-family: monospace;">${orderId}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666;">Montant :</td>
            <td style="padding: 5px 0; font-weight: bold;">${formattedAmount} ${currencySymbol}</td>
          </tr>
        </table>
      </div>

      <div style="padding: 0 5px; margin-bottom: 25px;">
        <h2 style="font-size: 12px; text-transform: uppercase; color: #888; margin: 0 0 10px 0; letter-spacing: 1px;">Adresse de livraison</h2>
        <p style="font-size: 14px; line-height: 1.5; margin: 0; color: #000;">
          <strong>${customerName}</strong><br/>
          ${addressHtml}
        </p>
        <p style="font-size: 14px; margin-top: 10px; color: #000;">
          <span style="color: #888;">Tél :</span> ${customerPhone}
        </p>
      </div>

      <div style="background-color: #000; color: #fff; padding: 15px; text-align: center; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
        Nous vous contacterons dès l'expédition du colis
      </div>
      
      <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Signature Sarphotar</p>
        <p style="font-size: 10px; color: #999; margin: 5px 0 0 0;">Qualité premium. Réalisme tactique.</p>
      </div>
    </div>
  `;

  return await transporter.sendMail({
    from: `"Sarphotar™" <${process.env.MAIL_FROM}>`,
    to: to,
    subject: `Confirmation de commande Sarphotar – ${orderId}`,
    html: htmlContent,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const targetEmail = (req.query.to as string) || process.env.MAIL_FROM;

  if (!process.env.MAIL_FROM || !process.env.MAIL_APP_PASSWORD) {
    return res.status(500).json({ error: "Configuration email manquante." });
  }

  // SIMULATION DE DONNÉES STRIPE
  const mockOrderId = `SAR-SIM-${Math.floor(100000 + Math.random() * 900000)}`;
  const mockCustomerDetails = {
    email: targetEmail,
    name: "Jean Dupont (Test)",
    phone: "+33 6 12 34 56 78",
    address: {
      line1: "12 Rue de la Paix",
      line2: "Appartement 4B",
      city: "Paris",
      postal_code: "75002",
      country: "FR"
    }
  };

  try {
    await sendConfirmationEmail(
      targetEmail!,
      mockOrderId,
      2999, // 29.99€
      "eur",
      mockCustomerDetails,
      mockCustomerDetails // On simule que shipping = customer
    );

    return res.status(200).json({
      success: true,
      message: `Simulation réussie. Un mail détaillé a été envoyé à ${targetEmail}`,
      details_simulated: mockCustomerDetails
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
