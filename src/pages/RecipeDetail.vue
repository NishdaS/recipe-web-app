<script setup>
import { onMounted, ref } from 'vue';      // Import Vue composition API functions
import { useRoute } from 'vue-router';    // Import vue-router hook to access route params

const route = useRoute();                  // Get the current route object
const recipe = ref(null);                  // Reactive variable to hold the selected recipe data

onMounted(async () => {                    // When component mounts, fetch recipe data
  // Fetch the recipes JSON file relative to current location
  const response = await fetch('../recipes.json');
  const recipes = await response.json();  // Parse the JSON response
  
  //used to identify which recipe to show.
  const slug = route.params.slug;         // Get the recipe slug from the route parameters

  // Find the recipe in the array whose name (lowercased and spaces replaced by '-') matches the slug
  recipe.value = recipes.find(r =>
    r.Name.toLowerCase().replace(/\s+/g, '-') === slug
  );
});
</script>

<!--Show Recipe When It's Loaded--> 
<template>
  <div class="container mt-5" v-if="recipe">
    <!-- Recipe Title and Author -->
    <div class="text-center mb-4">
      <h1 class="display-5 fw-bold text-warning">{{ recipe.Name }}</h1>
      <p class="text-muted"><i>By: {{ recipe.Author }}</i></p>
    </div>

    <!-- Recipe Description Section -->
    <div class="card mb-4 shadow-sm border-0">
      <div class="card-body">
        <p class="card-text">{{ recipe.Description }}</p>
      </div>
    </div>

    <!-- Ingredients List Section -->
    <div class="card mb-4 shadow-sm border-0">
      <div class="card-body">
        <h4 class="card-title fw-bold">Ingredients</h4>
        <ul class="list-group list-group-flush">
          <!-- Loop through each ingredient and display as a list item -->
          <li class="list-group-item" v-for="(ingredient, index) in recipe.Ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Cooking Method Steps Section -->
    <div class="card mb-5 shadow-sm border-0">
      <div class="card-body">
        <h4 class="card-title fw-bold">Method</h4>
        <ol class="list-group list-group-numbered list-group-flush">
          <!-- Loop through each step in the method and display as an ordered list -->
          <li class="list-group-item" v-for="(step, index) in recipe.Method" :key="index">
            {{ step }}
          </li>
        </ol>
      </div>
    </div>
  </div>

  <!-- Loading spinner shown while recipe data is being fetched -->
  <div v-else class="text-center mt-5">
    <div class="spinner-border text-warning" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="mt-3">Loading recipe...</p>
  </div>
</template>
