<template>
  <!-- Fußzeile wie in Meldeportal und SR-Abrechnung (nbbv-webservices, footer in shared/components.css):
       Angebot · Maßgeblich · Kontakt/Impressum/Datenschutz -->
  <footer class="nbbv-footer">
    <p>
      Ein Angebot des
      <a href="https://www.nbbv.de" target="_blank" rel="noopener">Niedersächsisch-Bremischen Basketballverbands e.V.</a>
    </p>
    <p v-if="infoUrl">
      Maßgeblich:
      <a :href="infoUrl" target="_blank" rel="noopener">Durchführungsbestimmungen und Anleitung</a>
    </p>
    <p>
      <a :href="contactHref">Kontakt: {{ contactEmail }}</a>
      · <a :href="imprintUrl" target="_blank" rel="noopener">Impressum</a>
      · <a :href="privacyUrl" target="_blank" rel="noopener">Datenschutz</a>
    </p>
    <p class="nbbv-footer-credit">
      Basiert auf
      <a href="https://github.com/dirkdrutschmann/srbasar-frontend" target="_blank" rel="noopener">SR Basar</a>
      von Dirk Drutschmann
    </p>
  </footer>
</template>

<script setup>
const siteName = import.meta.env.VITE_SITE_NAME || 'NBBV-Spielbörse'
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'support@nbbv.de'
const contactHref = `mailto:${contactEmail}?subject=${encodeURIComponent(siteName)}`
const imprintUrl = import.meta.env.VITE_IMPRINT_URL || 'https://www.nbbv.de/de/rechtliches/impressum/'
const privacyUrl = import.meta.env.VITE_PRIVACY_URL || 'https://www.nbbv.de/de/rechtliches/datenschutz/'
// Infoseite auf nbbv.de (Anleitung, Durchführungsbestimmungen)
const infoUrl = import.meta.env.VITE_INFO_URL || ''
</script>

<style scoped>
/* Werte wie footer in nbbv-webservices/shared/components.css */
.nbbv-footer {
  width: 100%;
  margin-top: 24px;
  padding: 10px;
  color: var(--nbbv-muted);
  font-size: 0.85rem;           /* entspricht --nbbv-fs-small bei 16px Basis */
  line-height: 1.35;
  text-align: center;
}

.nbbv-footer p {
  max-width: 75ch;
  margin: 4px auto;
  /* app.css des Originals färbt alle Absätze weiß (altes dunkles Layout) */
  color: inherit;
}

.nbbv-footer a {
  color: var(--nbbv-navy);
  font-weight: 600;
}

.nbbv-footer a:hover {
  color: var(--nbbv-orange);
}

.nbbv-footer-credit {
  color: var(--nbbv-muted-2);
  font-size: 0.9em;
}

.nbbv-footer-credit a {
  font-weight: 400;
}
</style>
