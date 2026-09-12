<template>
  <nav v-if="isAuthenticated" class="navbar navbar-expand-lg">
    <div class="container">
      <button
        v-if="isAuthenticated"
        class="navbar-toggler bg-white"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul v-if="isAuthenticated" class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/basar">Basar</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/vereine">Vereine</router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/admin/users">Admin</router-link>
          </li>
        </ul>

        <ul v-if="isAuthenticated" class="navbar-nav ms-auto">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ currentUser?.username || 'Benutzer' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link class="dropdown-item" to="/profile">Profil</router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout">Abmelden</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.getIsAuthenticated())
const currentUser = computed(() => authStore.getCurrentUser())
const isAdmin = computed(() => currentUser.value?.role === 'admin')

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: #001d33;
  border-bottom: 1px solid #111;
  padding: 0.4rem 0;
  flex-shrink: 0;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 0.85rem;
  padding: 0.35rem 0.75rem !important;
}

.nav-link:hover {
  color: white !important;
}

.nav-link.router-link-active {
  color: white !important;
  text-decoration: underline;
}

.dropdown-menu {
  border: 1px solid #dee2e6;
  background-color: white;
  font-size: 0.85rem;
}

.dropdown-item {
  padding: 0.35rem 1rem;
  color: #212529;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #212529;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    margin-top: 0.25rem;
  }
}
</style>
