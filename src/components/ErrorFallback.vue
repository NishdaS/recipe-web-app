<!--
This Vue component displays a simple error message when something goes 
wrong on the page (e.g., data fails to load). It shows a warning icon 
and a "Retry" button that reloads the page when clicked.
-->

<script setup>
// Function to reload the current page
function reloadPage() {
  location.reload();
}
</script>

<template>
  <div class="d-flex flex-column justify-content-center align-items-center text-danger p-4 text-center">
    <p class="fw-semibold">⚠️ Oops! Something went wrong while loading this page.</p>
    <button class="btn btn-success rounded px-3 py-2">Retry</button>
  </div>
</template>

