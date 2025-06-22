<!-- Footer.vue -->
<template>
  <!-- Footer element with margin-top auto to push it to bottom, padding, light background, and centered text -->
  <footer class="footer mt-auto py-3 bg-light text-center">
    <div class="container">
      <!-- Copyright text with muted color, block display and bottom margin -->
      <span class="text-muted d-block mb-2">&copy; 🍓 Fathima Cooks & Bakes. All rights reserved.</span>

      <!-- Navigation links container:
           Uses flexbox to center links horizontally,
           wraps links on small screens,
           adds gap between links,
           muted text color,
           removes underline decoration,
           and makes text semibold -->
      <div class="d-flex justify-content-center flex-wrap gap-3 text-muted text-decoration-none fw-semibold">
        
        <!-- Footer navigation links using router-link -->
        <router-link
          to="/"
          class="text-muted text-decoration-none"
        >Home</router-link>

        <router-link
          to="/about"
          class="text-muted text-decoration-none"
        >About</router-link>

        <router-link
          to="/news"
          class="text-muted text-decoration-none"
        >News</router-link>

        <router-link
          to="/recipes"
          class="text-muted text-decoration-none"
        >Recipes</router-link>

        <!-- Note: This links to /about but is labeled Contact. -->
        <router-link
          to="/about"
          class="text-muted text-decoration-none"
        >Contact</router-link>

        <router-link
          to="/privacy"
          class="text-muted text-decoration-none"
        >Privacy Policy</router-link>

        <router-link
          to="/terms"
          class="text-muted text-decoration-none"
        >Terms of Service</router-link>
      </div>
    </div>
  </footer>
</template>
