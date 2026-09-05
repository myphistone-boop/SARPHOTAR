/** Prix au format français : « 34,99 € » (virgule, espace insécable, symbole €). */
export function euro(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}
