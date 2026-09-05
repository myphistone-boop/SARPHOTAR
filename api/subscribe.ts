import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

/**
 * Inscription à la liste de diffusion.
 *
 * Il n'y a pas de base de données sur ce projet : chaque inscription est
 * transmise par e-mail à la boutique, qui peut ensuite l'importer dans son
 * outil d'emailing. C'est volontairement simple — mieux vaut une capture
 * qui fonctionne qu'une intégration à configurer.
 *
 * Comme /api/contact, le destinataire est FIXE : cette route ne peut pas
 * servir à envoyer un message à un tiers.
 *
 * RGPD : le consentement est recueilli côté client par une case à cocher
 * décochée par défaut, et l'horodatage est conservé dans l'e-mail — c'est
 * la preuve du consentement exigée en cas de contrôle.
 */

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.MAIL_FROM || !process.env.MAIL_APP_PASSWORD) {
    return res.status(503).json({ error: 'Inscription momentanément indisponible.' });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Trop de tentatives. Réessayez plus tard.' });

  const body = (req.body ?? {}) as Record<string, unknown>;

  // Champ piège.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return res.status(200).json({ ok: true });
  }

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 160) : '';
  const consent = body.consent === true;
  const source = typeof body.source === 'string' ? body.source.slice(0, 40) : 'site';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: 'Adresse e-mail invalide.' });
  }
  if (!consent) {
    return res.status(400).json({ error: 'Merci d’accepter de recevoir nos offres pour vous inscrire.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.MAIL_FROM, pass: process.env.MAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"Sarphotar™ · Inscription" <${process.env.MAIL_FROM}>`,
      to: process.env.MAIL_FROM,
      subject: `Nouvelle inscription — ${email}`,
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; font-size: 14px; color: #111;">
          <p><strong>Nouvelle inscription à la liste de diffusion</strong></p>
          <p>E-mail : <a href="mailto:${esc(email)}">${esc(email)}</a></p>
          <p>Campagne : ${esc(source)}</p>
          <p>Consentement recueilli le ${new Date().toISOString()}</p>
        </div>
      `,
    });
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('Subscribe : échec envoi', error?.message);
    return res.status(502).json({ error: "L'inscription a échoué. Merci de réessayer." });
  }
}
