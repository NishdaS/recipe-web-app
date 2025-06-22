<script setup>
import { ref, computed, onMounted } from 'vue'; // Import Vue Composition API functions
import { useRouter } from 'vue-router'; // Import router composable for navigation

// Base URL for assets and API calls, fallback to '/'
const base = import.meta.env.BASE_URL || '/';  // Initialize router instance for navigation
const router = useRouter(); // router is initialized using useRouter() to handle navigation.

// Reactive reference to hold full recipe data loaded from JSON
const recipeData = ref([]);

// Hardcoded arrays for featured recipe groups with names and images only
// These will get authors merged in later after loading full data
const seasonalDelights = ref([
  { Name: "Very berry trifle", image: `${base}assets/very-berry-trifle.jpg` },
  { Name: "Florentine biscuits", image: `${base}assets/florentine-biscuits.jpg` },
  { Name: "Pear, chocolate & marzipan strudel", image: `${base}assets/pear-choc-strudel.jpg` },
]);

const chefsPicks = ref([
  { Name: "Healthy roast turkey crown", image: `${base}assets/healthy-roast-turkey-crown.jpg` },
  { Name: "Clementine & prosecco jellies", image: `${base}assets/clementine-prosecco-jellies.jpg` },
  { Name: "Crunchy confit roast potatoes", image: `${base}assets/crunchy-confit-roast-potatoes.jpg` },
  { Name: "Crunchy crab parcels", image: `${base}assets/crunchy-crab-parcels.jpg` },
  { Name: "Bay, popcorn & cranberry strings", image: `${base}assets/bay-popcorn-cranberry-strings.jpg` },
  { Name: "Roasted squash & lentil salad", image: `${base}assets/roasted-squash-lentil-salad.jpg` },
]);

// Computed property for styling the hero section background and text color
// It's reactive, meaning it will update if the underlying base URL changes.
const heroStyle = computed(() => ({
  backgroundImage: `url('${base}assets/hero.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '12px',
  color: 'white',
}));

// Navigate to a detailed recipe page when a recipe card is clicked
function goToRecipe(name) {
  // Create slug from recipe name (lowercase, spaces replaced with dashes)
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  // Find full recipe data from loaded recipeData array by matching name
  const selected = recipeData.value.find(r => r.Name === name);
  // Navigate to /recipe/:slug with recipe data passed in router state
  router.push({
    path: `/recipe/${slug}`, //destination path - where :slug is the recipe’s slug (e.g., /recipe/very-berry-trifle).
    state: { recipe: selected }
  });
}

// Merge author information from full recipeData into the displayed lists
function mergeAuthors(list) {
  list.forEach(recipe => {
    // This condition checks if the name of the recipe in the recipeData array matches the name of the recipe in the current list.
    const fullRecipe = recipeData.value.find(r => r.Name === recipe.Name);
    // Set the Author property to the found author's name or fallback to "Unknown Chef"
    recipe.Author = fullRecipe?.Author || "Unknown Chef";
  });
}

// Load the full recipe data from JSON file and merge authors into recipe groups
async function loadRecipeData() {
  try {
    // Fetch recipes.json from base URL
    const res = await fetch(`${base}recipes.json`);
    // Parse JSON response and assign to reactive recipeData
    recipeData.value = await res.json();

    // Merge author info for both recipe groups
    mergeAuthors(seasonalDelights.value);
    mergeAuthors(chefsPicks.value);

    // Re-assign arrays to trigger Vue reactivity for updated Author fields
    seasonalDelights.value = [...seasonalDelights.value];
    chefsPicks.value = [...chefsPicks.value];
  } catch (error) {
    // Log error if fetching or parsing fails
    console.error("Error loading recipe data:", error);
  }
}

// This function is not currently used but could assign default author if missing
function assignAuthors(list) {
  list.forEach(recipe => {
    if (!recipe.Author) {
      recipe.Author = "Unknown Chef";
    }
  });
}

// Lifecycle hook: Load recipe data when component is mounted
onMounted(() => {
  loadRecipeData(); //Data Fetching Happens asynchronously After the Component is Mounted
});
</script>

<template>
  <div class="container mt-4">

    <!-- Hero Section -->
    <section class="text-center py-5" :style="heroStyle">
      <div style="background-color: rgba(0,0,0,0.5); padding: 3rem; border-radius: 12px;">
        <h1 class="display-4 fw-bold text-warning">Cook, Bake, and Celebrate!</h1>
        <p class="lead">Over 100+ easy-to-follow recipes for all occasions</p>
        <router-link to="/recipes">
          <button class="btn btn-warning btn-lg mt-3">Explore Recipes</button>
        </router-link>
      </div>
    </section>

    <!-- Seasonal Delights Section -->
    <section class="mt-5">
      <h3 class="mb-4">Seasonal Delights</h3>
      <div class="row">
        <div class="col-md-4 mb-3" v-for="recipe in seasonalDelights" :key="recipe.Name">
          <div class="card h-100 shadow-sm" @click="goToRecipe(recipe.Name)" style="cursor: pointer;">
            <img :src="recipe.image" class="card-img-top" :alt="recipe.Name">
            <div class="card-body">
              <h5 class="card-title">{{ recipe.Name }}</h5>
              <p class="card-text"><em>By {{ recipe.Author || 'Unknown' }}</em></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Chef's Picks Section -->
    <section class="mt-5">
      <h3 class="mb-4">Chef's Picks</h3>
      <div class="row">
        <div class="col-md-4 mb-3" v-for="recipe in chefsPicks" :key="recipe.Name">
          <div class="card h-100 shadow-sm" @click="goToRecipe(recipe.Name)" style="cursor: pointer;">
            <img :src="recipe.image" class="card-img-top" :alt="recipe.Name">
            <div class="card-body">
              <h5 class="card-title">{{ recipe.Name }}</h5>
              <p class="card-text"><em>By {{ recipe.Author || 'Unknown' }}</em></p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
