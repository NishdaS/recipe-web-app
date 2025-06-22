<script setup>
import { ref } from 'vue';                  // Import ref for reactive state
import { useAuth } from '../composables/useAuth';  // Import custom auth composable

// Destructure isLoggedIn reactive state and logout function from auth composable
const { isLoggedIn, logout } = useAuth();

// Reactive boolean to track if the mobile menu (hamburger menu) is open or closed
const isOpen = ref(false);
</script>

<template>
  <nav class="navbar">
    <!-- Navigation header contains logo and hamburger button for mobile -->
    <div class="nav-header">
      <!-- Logo that links to home page -->
      <router-link to="/" class="logo">🍓 Fathima Cooks & Bakes </router-link>
      
      <!-- Hamburger menu button toggles isOpen to show/hide mobile nav links -->
      <button class="hamburger" @click="isOpen = !isOpen">
        ☰
      </button>
    </div>

    <!-- Navigation links container -->
    <!-- On mobile, 'open' class toggled to show or hide links -->
    <div class="nav-links" :class="{ open: isOpen }">
      <!-- Main navigation links -->
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/news" class="nav-link">News</router-link>
      <router-link to="/about" class="nav-link">About</router-link>
      <router-link to="/recipes" class="nav-link">Recipes</router-link>

      <!-- Conditional rendering based on login state -->
      <template v-if="!isLoggedIn">
        <!-- If not logged in, show login and register links -->
        <router-link to="/login" class="nav-link">Login</router-link>
        <router-link to="/register" class="nav-link">Register</router-link>
      </template>
      <template v-else>
        <!-- If logged in, show logout button that triggers logout function -->
        <button @click="logout" class="logout-btn">Logout</button>
      </template>
    </div>
  </nav>
</template>
