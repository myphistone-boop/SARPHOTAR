# Sarphotar™ — sarphotar.fr

Boutique en ligne de pistolets à eau électriques rechargeables.
React 18 + Vite + Tailwind, paiement Stripe Checkout, déployée sur Vercel.

---

## Démarrer

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build de production
npm run preview      # servir le build localement
```

## Variables d'environnement

À définir dans le projet Vercel (Settings → Environment Variables).

| Variable | Rôle | Sans elle |
|---|---|---|
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | Aucun paiement possible |
| `STRIPE_WEBHOOK_SECRET` | Signature du webhook | Aucun e-mail de confirmation |
| `MAIL_FROM` | Compte Gmail expéditeur | Aucun e-mail envoyé |
| `MAIL_APP_PASSWORD` | Mot de passe d'application Gmail | Aucun e-mail envoyé |
| `BOOTSTRAP_TOKEN` | Protège les routes d'administration | Ces routes renvoient 503 (comportement voulu) |
| `NEXT_PUBLIC_SITE_URL` | URL de base (dev uniquement) | Retombe sur `https://sarphotar.fr` |
| `DELIVERY_DELAY_TEXT` | Texte de délai affiché dans Stripe | Texte par défaut |

---

## Où modifier quoi

Tout le contenu éditorial et factuel est isolé dans `content/`.
**Aucune donnée produit ne doit être écrite ailleurs.**

| Fichier | Contient | Modifier pour |
|---|---|---|
| `content/campaign.ts` | Les 8 campagnes saisonnières | Changer de période commerciale |
| `content/facts.ts` | Caractéristiques, livraison, retours, mentions légales | Renseigner une donnée vérifiée |
| `content/reviews.ts` | Avis clients réels | Ajouter un avis reçu |
| `content/offer.ts` | Promotion en cours | Lancer une vraie promotion |
| `content/media.ts` | Vidéo de démonstration | Publier la vidéo produit |
| `content/faq.ts` | FAQ (dérivée des faits) | Rien : elle se construit seule |
| `constants.ts` | Catalogue et prix affichés | Ajouter un produit |

### Règle de conception

> Une valeur `null` dans `content/facts.ts` n'est **pas affichée** sur le site.

Une caractéristique, un délai ou une garantie non renseignée disparaît de
l'interface, de la FAQ et des données structurées — plutôt que d'être inventée.
Renseigner la valeur la fait apparaître partout d'un coup.

---

## Changer de campagne saisonnière

Une seule ligne, dans `content/campaign.ts` :

```ts
export const CAMPAIGN_SEASON: SeasonId = 'late_summer';
```

Valeurs : `late_summer` · `autumn` · `halloween` · `black_friday` ·
`christmas` · `evergreen` · `pre_summer` · `summer`

Cela modifie le badge, le titre, le sous-titre, les CTA, le bloc de fin de page
et le texte de capture d'e-mail. **Aucune couleur ni typographie ne change** :
le design Sarphotar reste identique d'une saison à l'autre.

## Lancer une vraie promotion

1. Baissez réellement le prix dans Stripe.
2. Reportez le nouveau prix dans `constants.ts`.
3. Dans `content/offer.ts`, remplissez `OFFER` avec une date de fin réelle et,
   en `previousPrices`, le prix **réellement pratiqué avant**.

Le compte à rebours descend vers cette date puis l'offre disparaît d'elle-même.
Il ne redémarre pas. Le prix barré doit être le prix le plus bas pratiqué durant
les 30 jours précédents (art. L112-1-1 du code de la consommation).

## Collecter des avis

Le tableau `REVIEWS` de `content/reviews.ts` est vide : tant qu'il l'est,
aucune note ni compteur n'apparaît sur le site. N'y ajoutez que des avis
réellement reçus, et ne mettez `verifiedPurchase: true` que si la commande
est retrouvable dans Stripe.

---

## Routes API

| Route | Accès | Rôle |
|---|---|---|
| `POST /api/create-checkout-session` | public | Crée la session de paiement |
| `POST /api/stripe-webhook` | Stripe (signé) | E-mail de confirmation |
| `POST /api/contact` | public, limité | Formulaire de contact |
| `POST /api/subscribe` | public, limité | Inscription à la liste |
| `GET /api/init-stripe` | `BOOTSTRAP_TOKEN` | Crée produits et prix Stripe |
| `GET /api/test-email` | `BOOTSTRAP_TOKEN` | Test de configuration SMTP |
| `GET /api/simulate-purchase` | `BOOTSTRAP_TOKEN` | Simule un e-mail de commande |

Les routes d'administration s'appellent avec `?token=<BOOTSTRAP_TOKEN>` ou
l'en-tête `x-admin-token`. Le destinataire de `/api/contact` et
`/api/subscribe` est fixe : ces routes ne peuvent pas servir de relais.

---

## Suivi & publicité

- Pixel Meta : collez votre identifiant dans `window.PIXEL_ID` (`index.html`).
  Il n'est chargé qu'après consentement du visiteur.
- Événements câblés : `view_item`, `add_to_cart`, `begin_checkout`, `purchase`
  (avec valeur monétaire, nécessaire au calcul du ROAS).
- Lien profond publicitaire : `?p=<id produit>` ouvre directement la fiche.
  Exemple : `https://www.sarphotar.fr/?p=novelec-gatling`
- Suivi d'affiliation : `?ref=<tag>`, transmis à Stripe dans les métadonnées.

## SEO

`tools/seo.ts` génère au build les métadonnées, le JSON-LD, `robots.txt` et
`sitemap.xml` à partir du catalogue réel. Aucune note agrégée n'est déclarée
tant qu'il n'existe pas d'avis réels.

---

## À faire avant de déployer

- [ ] Vérifier que les prix Stripe correspondent à `constants.ts`
- [ ] Renseigner l'identité légale dans `content/facts.ts` (`LEGAL_ENTITY`)
- [ ] Confirmer le marquage CE auprès du fournisseur (directive jouets 2009/48/CE)
- [ ] Définir `BOOTSTRAP_TOKEN` sur Vercel
- [ ] Passer une commande de test sur mobile et sur ordinateur
- [ ] Vérifier la réception des e-mails de confirmation
