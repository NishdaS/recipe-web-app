<script setup>
// Import the custom authentication composable to manage user login status
import { useAuth } from './composables/useAuth';

// Import shared layout components: Navbar and Footer
import Navbar from './pages/Navbar.vue'; 
import Footer from './pages/Footer.vue'; // Assumes a Footer.vue component exists in /pages

// Destructure reactive authentication state and logout method from useAuth()
const { isLoggedIn, logout } = useAuth();
</script>

<template>
  <!-- Root layout container for the app -->
  <div id="app-container">
    
    <!-- Navigation bar displayed at the top of every page -->
    <Navbar />

    <!-- Main content area where routed views (pages) are rendered -->
    <main class="content">
      <router-view />
    </main>

    <!-- Footer displayed at the bottom of every page -->
    <Footer />
  </div>
</template>
