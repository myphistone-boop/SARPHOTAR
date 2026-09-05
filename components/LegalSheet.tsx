import React, { useEffect, useState } from 'react';
import { LEGAL_ENTITY, legalEntityComplete, SHIPPING, RETURNS, WARRANTY, SUPPORT } from '../content/facts';

interface LegalSheetProps { isOpen: boolean; onClose: () => void; }
type TabType = 'legal' | 'cgv' | 'data' | 'refund' | 'shipping';

/**
 * Documents légaux.
 *
 * L'onglet « Mentions légales » manquait entièrement, alors qu'il est
 * obligatoire (art. 6-III de la LCEN pour l'éditeur et l'hébergeur,
 * art. L221-5 du code de la consommation pour la vente à distance).
 *
 * Les informations d'identité proviennent de LEGAL_ENTITY (content/facts.ts).
 * Celles qui ne sont pas renseignées ne sont pas affichées — le site
 * n'invente jamais un SIRET ou une raison sociale.
 */

const Row: React.FC<{ label: string; value: string | null }> = ({ label, value }) =>
  value ? (
    <p>
      <strong className="text-ghost">{label}</strong>
      <br />
      {value}
    </p>
  ) : null;

const LegalNotice: React.FC = () => (
  <>
    {!legalEntityComplete && (
      <div className="bg-surface2 border border-white/10 rounded-lg p-4 mb-4">
        <p className="text-ghost/85 text-[13px] leading-relaxed">
          Nos informations d’identification sont en cours de mise à jour. Pour toute demande
          concernant l’éditeur du site, contactez-nous à{' '}
          <a href={`mailto:${SUPPORT.email}`} className="text-accent underline">{SUPPORT.email}</a>.
        </p>
      </div>
    )}

    <p><strong className="text-ghost">Éditeur du site</strong></p>
    <Row label="Dénomination" value={LEGAL_ENTITY.companyName} />
    <Row label="Forme juridique" value={LEGAL_ENTITY.legalForm} />
    <Row label="Capital social" value={LEGAL_ENTITY.capital} />
    <Row label="Siège social" value={LEGAL_ENTITY.address} />
    <Row label="SIRET" value={LEGAL_ENTITY.siret} />
    <Row label="RCS" value={LEGAL_ENTITY.rcs} />
    <Row label="TVA intracommunautaire" value={LEGAL_ENTITY.vatNumber} />
    <Row label="Directeur de la publication" value={LEGAL_ENTITY.publicationDirector} />
    <Row label="Téléphone" value={LEGAL_ENTITY.phone} />

    <p>
      <strong className="text-ghost">Contact</strong>
      <br />
      <a href={`mailto:${SUPPORT.email}`} className="text-accent underline">{SUPPORT.email}</a> · {SUPPORT.responseTime}
    </p>

    <p>
      <strong className="text-ghost">Hébergeur</strong>
      <br />
      {LEGAL_ENTITY.host.name}
      <br />
      {LEGAL_ENTITY.host.address}
      <br />
      <a href={LEGAL_ENTITY.host.url} target="_blank" rel="noopener noreferrer" className="text-accent underline">
        {LEGAL_ENTITY.host.url}
      </a>
    </p>

    <p>
      <strong className="text-ghost">Propriété intellectuelle</strong>
      <br />
      L’ensemble des contenus de ce site (textes, images, marques) est protégé. Toute reproduction sans
      autorisation est interdite.
    </p>
  </>
);

const Cgv: React.FC = () => (
  <>
    <p><strong className="text-ghost">1. Objet</strong><br />Les présentes conditions régissent les ventes de pistolets à eau électriques réalisées sur {LEGAL_ENTITY.siteUrl}.</p>
    <p><strong className="text-ghost">2. Prix</strong><br />Les prix sont indiqués en euros toutes taxes comprises. Le prix applicable est celui affiché au moment de la validation de la commande. {SHIPPING.free ? 'Les frais de livraison sont offerts.' : 'Les frais de livraison sont indiqués avant validation.'}</p>
    <p><strong className="text-ghost">3. Commande</strong><br />La commande est validée après acceptation du paiement. Un e-mail de confirmation reprenant la référence de commande vous est adressé.</p>
    <p><strong className="text-ghost">4. Paiement</strong><br />Le règlement s’effectue par carte bancaire via la plateforme sécurisée Stripe. Aucune coordonnée bancaire n’est conservée par {LEGAL_ENTITY.siteName}.</p>
    <p><strong className="text-ghost">5. Livraison</strong><br />Les commandes sont préparées et expédiées sous {SHIPPING.handling}. Zones desservies : {SHIPPING.countries.join(', ')}.</p>
    <p><strong className="text-ghost">6. Droit de rétractation</strong><br />Vous disposez de {RETURNS.withdrawalDays} jours à compter de la réception pour exercer votre droit de rétractation, sans avoir à motiver votre décision (art. L221-18 du code de la consommation).</p>
    <p><strong className="text-ghost">7. Garanties</strong><br />Tous les produits bénéficient de la garantie légale de conformité ({WARRANTY.legalConformityYears} ans, art. L217-3 et suivants) et de la garantie contre les vices cachés (art. 1641 du code civil).</p>
    <p><strong className="text-ghost">8. Réclamations</strong><br />Toute réclamation peut être adressée à <a href={`mailto:${SUPPORT.email}`} className="text-accent underline">{SUPPORT.email}</a>.</p>
    {LEGAL_ENTITY.mediator ? (
      <p><strong className="text-ghost">9. Médiation de la consommation</strong><br />En cas de litige non résolu, vous pouvez recourir gratuitement au médiateur : {LEGAL_ENTITY.mediator.name} — <a href={LEGAL_ENTITY.mediator.url} target="_blank" rel="noopener noreferrer" className="text-accent underline">{LEGAL_ENTITY.mediator.url}</a>. Vous pouvez également utiliser la plateforme européenne de règlement des litiges.</p>
    ) : null}
  </>
);

const Privacy: React.FC = () => (
  <>
    <p><strong className="text-ghost">1. Données collectées</strong><br />Nous collectons uniquement les données nécessaires au traitement de votre commande : nom, adresse de livraison et de facturation, adresse e-mail et numéro de téléphone.</p>
    <p><strong className="text-ghost">2. Finalité et base légale</strong><br />Ces données servent à exécuter le contrat de vente, à vous livrer et à assurer le service après-vente. Le traitement repose sur l’exécution du contrat (art. 6.1.b du RGPD).</p>
    <p><strong className="text-ghost">3. Destinataires</strong><br />Vos données sont transmises à Stripe (traitement du paiement) et au transporteur chargé de la livraison. Elles ne sont ni vendues ni cédées à des tiers.</p>
    <p><strong className="text-ghost">4. Durée de conservation</strong><br />Les données de commande sont conservées le temps nécessaire au suivi commercial et aux obligations comptables légales.</p>
    <p><strong className="text-ghost">5. Cookies et mesure d’audience</strong><br />Les cookies de mesure d’audience et publicitaires ne sont déposés qu’après votre consentement, que vous pouvez modifier ou retirer à tout moment.</p>
    <p><strong className="text-ghost">6. Vos droits</strong><br />Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité. Pour l’exercer, écrivez à <a href={`mailto:${SUPPORT.email}`} className="text-accent underline">{SUPPORT.email}</a>. Vous pouvez également introduire une réclamation auprès de la CNIL.</p>
  </>
);

const Refund: React.FC = () => (
  <>
    <p><strong className="text-ghost">1. Rétractation</strong><br />Vous disposez de {RETURNS.withdrawalDays} jours à compter de la réception pour nous informer de votre souhait de vous rétracter, par e-mail à <a href={`mailto:${SUPPORT.email}`} className="text-accent underline">{SUPPORT.email}</a>.</p>
    <p><strong className="text-ghost">2. Retour du produit</strong><br />Le produit doit être renvoyé complet, dans son état d’origine, dans les 14 jours suivant votre demande.</p>
    <p><strong className="text-ghost">3. Frais de retour</strong><br />{RETURNS.returnShippingPaidByCustomer ? 'Les frais de retour restent à votre charge.' : 'Les frais de retour sont pris en charge par ' + LEGAL_ENTITY.siteName + '.'}</p>
    <p><strong className="text-ghost">4. Remboursement</strong><br />Le remboursement est effectué au plus tard 14 jours après récupération du produit, par le même moyen de paiement que celui utilisé lors de la commande.</p>
    <p><strong className="text-ghost">5. Produit défectueux</strong><br />En cas de défaut, la garantie légale de conformité s’applique pendant {WARRANTY.legalConformityYears} ans. Contactez-nous, les frais de retour sont alors à notre charge.</p>
  </>
);

const Shipping: React.FC = () => (
  <>
    <p><strong className="text-ghost">1. Zones desservies</strong><br />{SHIPPING.countries.join(', ')}.</p>
    <p><strong className="text-ghost">2. Préparation et expédition</strong><br />Les commandes sont préparées et expédiées sous {SHIPPING.handling}.{SHIPPING.carrier ? ` Elles sont acheminées par ${SHIPPING.carrier}.` : ''}</p>
    <p><strong className="text-ghost">3. Frais</strong><br />{SHIPPING.free ? 'Les frais de livraison sont offerts.' : 'Les frais de livraison sont indiqués avant la validation de la commande.'}</p>
    <p><strong className="text-ghost">4. Suivi</strong><br />{SHIPPING.trackingAlways ? 'Un numéro de suivi vous est communiqué dès l’expédition.' : 'Un numéro de suivi vous est communiqué lorsqu’il est disponible.'}</p>
    <p><strong className="text-ghost">5. Retard ou colis non reçu</strong><br />En cas de retard, écrivez-nous à <a href={`mailto:${SUPPORT.email}`} className="text-accent underline">{SUPPORT.email}</a> en précisant votre référence de commande.</p>
  </>
);

const CONTENT: Record<TabType, { title: string; body: React.ReactNode }> = {
  legal: { title: 'Mentions légales', body: <LegalNotice /> },
  cgv: { title: 'Conditions générales de vente', body: <Cgv /> },
  data: { title: 'Politique de confidentialité', body: <Privacy /> },
  refund: { title: 'Rétractation & remboursement', body: <Refund /> },
  shipping: { title: 'Livraison', body: <Shipping /> },
};

const TABS: { id: TabType; label: string }[] = [
  { id: 'legal', label: 'Mentions' },
  { id: 'cgv', label: 'CGV' },
  { id: 'data', label: 'Données' },
  { id: 'refund', label: 'Retours' },
  { id: 'shipping', label: 'Livraison' },
];

export const LegalSheet: React.FC<LegalSheetProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<TabType>('legal');

  useEffect(() => {
    if (isOpen) { setMounted(true); setTab('legal'); document.body.style.overflow = 'hidden'; }
    else { const t = setTimeout(() => setMounted(false), 300); document.body.style.overflow = ''; return () => clearTimeout(t); }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-end justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-2xl bg-surface border-t border-white/10 rounded-t-xl3 h-[85vh] flex flex-col pb-safe ${isOpen ? 'sheet-in' : ''}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <h2 className="text-xl font-black italic uppercase font-display text-ghost">Informations légales</h2>
          <button onClick={onClose} aria-label="Fermer" className="p-2 hover:bg-white/10 rounded-full text-ghost">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="flex gap-2 px-5 py-3 overflow-x-auto no-scrollbar border-b border-white/8">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 font-hud text-[11px] uppercase tracking-wide px-4 py-2 rounded-full transition-colors ${tab === t.id ? 'bg-ghost text-carbon' : 'text-muted hover:text-ghost bg-white/[0.03]'}`}>{t.label}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 text-sm leading-loose text-muted">
          <div className="space-y-4 screen-in">
            <h3 className="text-lg font-black uppercase text-ghost mb-3 font-display italic">{CONTENT[tab].title}</h3>
            {CONTENT[tab].body}
          </div>
        </div>
      </div>
    </div>
  );
};
