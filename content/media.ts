/**
 * ============================================================================
 *  MÉDIAS DE DÉMONSTRATION
 * ============================================================================
 *
 *  La section « NovElec™ en action » est le meilleur levier de conversion
 *  d'une fiche produit : elle répond à la question « est-ce que ça marche
 *  vraiment ? », que ni le texte ni un rendu 3D ne peuvent trancher.
 *
 *  Tant que `demoVideo` vaut `null`, la section entière est masquée —
 *  mieux vaut pas de section qu'un lecteur vide ou une vidéo d'illustration
 *  qui ne montre pas le produit réel.
 *
 *  ── CE QUE LA VIDÉO DOIT MONTRER ──────────────────────────────────────
 *    • le produit en main (échelle réelle)
 *    • l'activation
 *    • le tir, en continu
 *    • la portée
 *    • une utilisation réelle, en extérieur
 *
 *  Une vidéo tournée au téléphone, authentique, convertit mieux qu'un rendu
 *  3D : elle prouve que le produit existe et fonctionne.
 *
 *  ── FORMAT RECOMMANDÉ ─────────────────────────────────────────────────
 *  MP4 (H.264), vertical 9:16 pour le mobile, moins de 3 Mo, sans son
 *  indispensable. Hébergez-la sur le même bucket que les images produit
 *  (storage.googleapis.com/novelec_assets) pour éviter un script tiers.
 * ============================================================================
 */

export interface DemoVideo {
  /** URL du fichier vidéo (MP4 de préférence). */
  src: string;
  /** Image affichée avant lecture — évite de télécharger la vidéo pour rien. */
  poster: string;
  /** Description pour l'accessibilité et le référencement. */
  description: string;
}

/**
 * ⬇️  LA VIDÉO DE DÉMONSTRATION
 *
 *  Exemple une fois la vidéo tournée et hébergée :
 *
 *  export const demoVideo: DemoVideo | null = {
 *    src: 'https://storage.googleapis.com/novelec_assets/demo-novelec.mp4',
 *    poster: 'https://storage.googleapis.com/novelec_assets/Pistolet.webp',
 *    description: 'Démonstration du Pistolet NovElec™ : prise en main, tir continu et portée.',
 *  };
 */
export const demoVideo: DemoVideo | null = {
  src: '/demo-novelec.mp4',
  poster: '/demo-poster.jpg',
  description: 'Le pistolet à eau électrique NovElec™ en action.',
};
