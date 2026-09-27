<template>
  <!-- Gemeinsamer Seitenkopf der NBBV-Dienste (styles/nbbv-header.css, Kopie aus nbbv-webservices) -->
  <header class="nbbv-header" :class="{ 'is-condensed': isCondensed }">
    <div class="nbbv-header-inner">
      <a v-if="logo" class="nbbv-header-logo" :href="logoLink" target="_blank" rel="noopener">
        <img :src="logo" :alt="logoAlt" />
      </a>
      <h1 class="nbbv-header-title">
        <span class="nbbv-header-name">{{ name }}</span>{{ ' ' }}<span class="nbbv-header-sub">{{ sub }}</span>
      </h1>
      <!-- Ziel für Aktionen der Seite (per Teleport, z. B. Aktualisieren) -->
      <div id="nbbv-header-actions" class="nbbv-header-actions"></div>
    </div>
  </header>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  name: { type: String, required: true },
  sub: { type: String, default: '' },
  logo: { type: String, default: '' },
  logoLink: { type: String, default: 'https://www.nbbv.de' },
  logoAlt: { type: String, default: 'Niedersächsisch-Bremischer Basketballverband e.V.' }
})

// Wie shared/header.js: Einbettung erkennen und beim Scrollen einklappen
const isCondensed = ref(false)

const isEmbedded = typeof window !== 'undefined' && window.self !== window.top
if (isEmbedded) {
  document.documentElement.classList.add('embedded')
}

function update() {
  // Eingebettet läuft der Kopf nicht mit, also auch kein Einklappen
  isCondensed.value = !isEmbedded && window.scrollY > 12
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
})
</script>
