import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { buildJsonLd, buildMetaTags, buildRobotsTxt, buildSitemap, seoTitle, seoDescription, assertPricesConsistent } from './tools/seo';

/**
 * Injecte les métadonnées SEO dans index.html et émet robots.txt / sitemap.xml.
 *
 * Le site étant une application monopage, les robots ne voient que le HTML
 * initial : ces balises sont donc la seule information dont disposent Google
 * et les aperçus de partage. Les générer au build depuis le catalogue évite
 * qu'un prix affiché diverge du prix déclaré dans les données structurées.
 */
function seoPlugin(): Plugin {
  return {
    name: 'sarphotar-seo',
    buildStart() {
      // Un prix incohérent doit bloquer le déploiement, pas partir en production.
      assertPricesConsistent();
    },
    transformIndexHtml(html) {
      const jsonLd = buildJsonLd()
        .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
        .join('\n    ');

      return html
        .replace('<!--%SEO_META%-->', buildMetaTags())
        .replace('<!--%SEO_JSONLD%-->', jsonLd)
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${seoTitle}</title>`)
        .replace(
          /<meta name="description" content="[\s\S]*?" \/>/,
          `<meta name="description" content="${seoDescription.replace(/"/g, '&quot;')}" />`
        );
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobotsTxt() });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap() });
    },
  };
}

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), seoPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // Le vendor React change rarement : le séparer permet au navigateur de
    // garder le cache entre deux déploiements de la boutique.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
