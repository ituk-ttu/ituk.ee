<script setup>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';
</script>

<template>
  <Navbar />
  <main class="main-height">
    <router-view />
  </main>
  <Footer />
</template>