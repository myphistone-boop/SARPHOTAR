
/**
 * Script d'initialisation Stripe (Bootstrap)
 * Exécuter avec: node scripts/bootstrap-stripe.js
 * Nécessite: npm install stripe dotenv
 */
require('dotenv').config();
const Stripe = require('stripe');
const { OFFERS } = require('../api/stripe-config');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function bootstrap() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY manquant.');
    process.exit(1);
  }

  console.log('🚀 Démarrage du bootstrap Stripe...');

  for (const offer of OFFERS) {
    try {
      // 1. Vérifier si le prix existe déjà via lookup_key
      const prices = await stripe.prices.list({
        lookup_keys: [offer.key],
        expand: ['data.product'],
      });

      if (prices.data.length > 0) {
        console.log(`✅ [SKIP] L'offre "${offer.key}" existe déjà.`);
        continue;
      }

      console.log(`✨ Création de l'offre "${offer.key}"...`);

      // 2. Créer le produit
      const product = await stripe.products.create({
        name: offer.name,
        description: offer.description,
        metadata: {
            source: 'bootstrap-script',
            offerKey: offer.key
        }
      });

      // 3. Créer le prix avec lookup_key
      await stripe.prices.create({
        product: product.id,
        unit_amount: offer.amount,
        currency: offer.currency,
        lookup_key: offer.key,
        transfer_lookup_key: true, // Permet de conserver la clé si on migre de compte
      });

      console.log(`🎉 Offre "${offer.key}" créée avec succès!`);

    } catch (error) {
      console.error(`❌ Erreur pour "${offer.key}":`, error.message);
    }
  }

  console.log('🏁 Bootstrap terminé.');
}

bootstrap();
