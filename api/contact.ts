import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

/**
 * Formulaire de contact.
 *
 * Cette route manquait : le formulaire du site affichait « Message reçu »
 * sans effectuer le moindre appel réseau. Les clients ayant un problème de
 * commande croyaient avoir écrit, et personne ne recevait rien.
 *
 * Contrairement aux routes de diagnostic, celle-ci doit rester publique.
 * Elle n'est pour autant pas un relais ouvert :
 *
 *  • le destinataire est FIXE (MAIL_FROM) et ne peut pas être choisi par
 *    l'appelant — c'est ce qui différencie ce formulaire de test-email ;
 *  • les champs sont validés et tronqués ;
 *  • un champ piège (honeypot) écarte les robots les plus courants ;
 *  • une limite de fréquence par IP freine les envois en rafale.
 */

const MAX = { name: 80, email: 160, order: 40, message: 4000 } as const;

/**
 * Limitation de fréquence en mémoire. Les fonctions serverless étant
 * réparties sur plusieurs instances, ce garde-fou est volontairement
 * modeste : il absorbe les rafales sans prétendre à une protection stricte.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // borne mémoire
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

/** Échappe le HTML : le contenu client ne doit jamais être interprété. */
const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.MAIL_FROM || !process.env.MAIL_APP_PASSWORD) {
    console.error('Contact : configuration e-mail manquante.');
    return res.status(503).json({ error: 'Le formulaire est momentanément indisponible.' });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Trop de messages envoyés. Merci de réessayer plus tard.' });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;

  // Champ piège : invisible pour un humain, rempli par les robots.
  if (clean(body.website, 100) !== '') {
    return res.status(200).json({ ok: true }); // on ne signale rien au robot
  }

  const firstName = clean(body.firstName, MAX.name);
  const lastName = clean(body.lastName, MAX.name);
  const email = clean(body.email, MAX.email);
  const orderNumber = clean(body.orderNumber, MAX.order);
  const message = clean(body.message, MAX.message);

  if (!firstName || !email || !message) {
    return res.status(400).json({ error: 'Merci de renseigner votre nom, votre e-mail et votre message.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: 'Adresse e-mail invalide.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.MAIL_FROM, pass: process.env.MAIL_APP_PASSWORD },
  });

  const subject = orderNumber
    ? `Contact Sarphotar — commande ${orderNumber}`
    : `Contact Sarphotar — ${firstName} ${lastName}`.trim();

  const html = `
    <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; color: #111;">
      <h2 style="font-style: italic; text-transform: uppercase; border-bottom: 3px solid #000; padding-bottom: 8px;">
        Nouveau message · Sarphotar™
      </h2>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 4px 0; color: #666; width: 120px;">Nom</td><td style="padding: 4px 0;"><strong>${esc(firstName)} ${esc(lastName)}</strong></td></tr>
        <tr><td style="padding: 4px 0; color: #666;">E-mail</td><td style="padding: 4px 0;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        ${orderNumber ? `<tr><td style="padding: 4px 0; color: #666;">Commande</td><td style="padding: 4px 0; font-family: monospace;">${esc(orderNumber)}</td></tr>` : ''}
      </table>
      <div style="background: #f6f6f6; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${esc(message)}</div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Sarphotar™ · Contact" <${process.env.MAIL_FROM}>`,
      to: process.env.MAIL_FROM,   // destinataire fixe, non contrôlable par l'appelant
      replyTo: email,              // répondre écrit directement au client
      subject,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('Contact : échec envoi', error?.message);
    return res.status(502).json({ error: "L'envoi a échoué. Écrivez-nous directement par e-mail." });
  }
}
