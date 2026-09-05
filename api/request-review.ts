import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { requireAdmin } from './_auth.js';

/**
 * E-mail post-livraison « Votre NovElec™ est arrivé ⚡ » + demande d'avis.
 *
 * Déclenché MANUELLEMENT par la boutique une fois la commande livrée
 * (il n'y a pas de planificateur ni de suivi transporteur automatisé sur ce
 * projet). Réservé à l'administration via BOOTSTRAP_TOKEN.
 *
 * Objectif : construire une vraie bibliothèque d'avis et d'UGC. On demande
 * un retour authentique, éventuellement une photo/vidéo, avec autorisation
 * explicite d'utilisation. Les avis obtenus se saisissent ensuite à la main
 * dans content/reviews.ts — jamais fabriqués.
 *
 * Usage :
 *   GET /api/request-review?token=XXX&to=client@mail.fr&order=SAR-...&name=Karim
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAdmin(req, res)) return;

  if (!process.env.MAIL_FROM || !process.env.MAIL_APP_PASSWORD) {
    return res.status(503).json({ error: 'Configuration e-mail manquante.' });
  }

  const to = (req.query.to as string | undefined)?.trim();
  const order = (req.query.order as string | undefined)?.trim();
  const name = ((req.query.name as string | undefined)?.trim()) || 'à vous';

  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) {
    return res.status(400).json({ error: 'Paramètre "to" (e-mail) invalide.' });
  }

  const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #000; background: #fff; border: 1px solid #eee;">
      <h1 style="font-style: italic; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; border-bottom: 4px solid #000; padding-bottom: 10px;">SARPHOTAR™</h1>
      <p style="font-size: 18px; font-weight: bold;">Votre NovElec™ est arrivé ⚡</p>
      <p style="font-size: 14px; line-height: 1.6; color: #333;">Merci ${esc(name)} pour votre confiance. On espère que la première bataille a été à la hauteur.</p>
      <p style="font-size: 14px; line-height: 1.6; color: #333;">Comment s'est passée votre expérience ? Votre retour aide énormément les prochains acheteurs à se décider.</p>
      <p style="font-size: 14px; line-height: 1.6; color: #333;"><strong>Une photo ou une vidéo de votre NovElec™ en action ?</strong> Répondez simplement à cet e-mail : avec votre accord, on adore mettre en avant les batailles de nos clients.</p>
      ${order ? `<p style="font-size: 12px; color: #888;">Commande : <span style="font-family: monospace;">${esc(order)}</span></p>` : ''}
      <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px;">Une question ? Répondez à cet e-mail, on vous lit.</p>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.MAIL_FROM, pass: process.env.MAIL_APP_PASSWORD },
    });
    await transporter.sendMail({
      from: `"Sarphotar™" <${process.env.MAIL_FROM}>`,
      to,
      replyTo: process.env.MAIL_FROM,
      subject: 'Votre NovElec™ est arrivé ⚡ — un petit retour ?',
      html,
    });
    return res.status(200).json({ ok: true, sentTo: to });
  } catch (error: any) {
    console.error('request-review : échec envoi', error?.message);
    return res.status(502).json({ error: "L'envoi a échoué." });
  }
}
