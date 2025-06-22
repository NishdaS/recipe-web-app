<!--
  LoadingSpinner.vue
  -------------------
  This is a reusable Vue 3 component that displays a loading animation (spinner) 
  along with a "Loading..." message. It is useful for indicating to the user 
  that content is being fetched or processed in the background.

  Features:
  - Centered layout using Flexbox
  - CSS animation for rotating spinner
  - Styled with scoped CSS
-->

<template>
  <!-- Bootstrap-based loading spinner -->
  <div class="d-flex flex-column align-items-center py-4 text-success fw-bold">
    <!-- Bootstrap spinner component -->
    <div class="spinner-border text-success mb-3" role="status" style="width: 2.5rem; height: 2.5rem;">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="mb-0">Loading...</p>
  </div>
</template>
