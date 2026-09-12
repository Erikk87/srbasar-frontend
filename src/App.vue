<template>
  <div id="app">
    <AppHeader />

    <div class="page-title-bar">
      <h1 class="page-title">{{ appTitle }}</h1>
    </div>

    <main class="main-content">
      <div class="container-fluid">
        <router-view />
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'

const appTitle = import.meta.env.VITE_APP_TITLE || 'SR Basar'
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-title-bar {
  background: transparent;
  text-align: center;
  padding: 0.6rem 1rem 0.3rem;
}

.page-title {
  color: #001d33;
}

.main-content {
  flex: 1;
  background: transparent;
  display: flex;
  flex-direction: column;
}
</style>
