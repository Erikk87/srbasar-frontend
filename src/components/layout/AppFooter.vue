<template>
  <footer class="footer">
    <div class="footer-links">
      <a :href="githubFrontendUrl" target="_blank" class="footer-link">Frontend</a>
      <a :href="githubBackendUrl" target="_blank" class="footer-link">Backend</a>
      <a href="mailto:problems@srbasar.de" class="footer-link">Probleme melden</a>
      <router-link v-if="!isAuthenticated" to="/login" class="footer-link">Verwaltung</router-link>
      <span class="footer-copyright">© 2025 Dirk Drutschmann</span>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.getIsAuthenticated())

const githubFrontendUrl = import.meta.env.VITE_GITHUB_FRONTEND_URL || 'https://github.com'
const githubBackendUrl = import.meta.env.VITE_GITHUB_BACKEND_URL || 'https://github.com'
</script>

<style scoped>
.footer {
  background: #ffffff;
  border-top: 1px solid #dee2e6;
  padding: 0.4rem 0;
  flex-shrink: 0;
}

.footer-links {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 0.75rem;
}

.footer-link {
  color: #555555;
  text-decoration: none;
}

.footer-link:hover {
  color: #001d33;
  text-decoration: underline;
}

.footer-copyright {
  color: #888888;
}
</style>
