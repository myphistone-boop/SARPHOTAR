import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Garde d'accès pour les endpoints d'administration / diagnostic.
 *
 * Ces routes sont publiquement accessibles sur le domaine de production :
 * sans ce contrôle, n'importe qui peut les déclencher (et, pour les routes
 * d'e-mail, se servir de la boîte Gmail de la boutique comme relais ouvert).
 *
 * Le secret est lu dans BOOTSTRAP_TOKEN (déjà utilisé par init-stripe) et
 * accepté soit via `?token=`, soit via l'en-tête `x-admin-token`.
 *
 * Renvoie true si la requête est autorisée. Sinon la réponse est déjà
 * envoyée par la fonction et l'appelant doit simplement s'arrêter.
 */
export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const expected = process.env.BOOTSTRAP_TOKEN;

  // Pas de secret configuré => on refuse, plutôt que d'ouvrir la route à tous.
  if (!expected) {
    res.status(503).json({ error: 'Endpoint désactivé (BOOTSTRAP_TOKEN non configuré).' });
    return false;
  }

  const provided = (req.headers['x-admin-token'] as string | undefined) ?? (req.query.token as string | undefined);

  if (!provided || !safeEqual(provided, expected)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  return true;
}

/** Comparaison à temps constant (évite de laisser deviner le token octet par octet). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
