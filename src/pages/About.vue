<script setup>
import { ref, computed, onMounted } from 'vue'
import RecipeDetail from './RecipeDetail.vue'

// Fetching the recipes.json file will use the base URL configured in Vite.
// This ensures that the fetch URL works correctly when the app is deployed in a subdirectory.
// For example, if base URL is '/cos30043/s104791010/Project/recipe-app/',
// the fetch will request '/cos30043/s104791010/Project/recipe-app/recipes.json'.
fetch(`${import.meta.env.BASE_URL}recipes.json`)

// Page metadata
const name = ref('About')
const title = ref('About Fathima Cooks & Bakes')
const description = ref('A Vue.js app to explore and share delicious recipes.')

// User input fields
const firstName = ref('')
const lastName = ref('')
const diet = ref('')
const favoriteIngredient = ref('') // Used for filtering recipes by ingredient
const skillLevel = ref('')
const cookingGoals = ref('')

// Newsletter subscription input and feedback message
const newsletterEmail = ref('')
const newsletterMessage = ref('')

// Recipes loaded from JSON
const recipes = ref([])

// Computed property that filters recipes based on the favorite ingredient input
// Returns an empty array if no recipes loaded or no ingredient provided
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`.trim()
})

 // Convert the favorite ingredient to lowercase for case-insensitive matching
const filteredRecipes = computed(() => {
  if (!Array.isArray(recipes.value) || !favoriteIngredient.value.trim()) return []

  const lowerIngredient = favoriteIngredient.value.trim().toLowerCase()

  // Filter recipes whose Ingredients array contains the favorite ingredient (case-insensitive)
  return recipes.value
    .filter(recipe =>
      recipe.Ingredients?.some(ing =>
        ing.toLowerCase().includes(lowerIngredient)
      )
    )
    .map((recipe, index) => ({
      id: index,
      name: recipe.Name,
      author: recipe.Author || 'Unknown', // Fallback author if not provided
      ingredients: recipe.Ingredients,
      url: recipe.url || null,
      description: recipe.Description || '',
      method: recipe.Method || '',
    }))
})

// Fetch recipes.json data when the component mounts
onMounted(() => {
  fetch(`${import.meta.env.BASE_URL}recipes.json`) // Fetch from the correct base URL
    .then(response => {
      if (!response.ok) throw new Error('Failed to load recipes') // Throw error if fetch fails
      return response.json()
    })
    .then(data => {
      recipes.value = data // Assign fetched data to recipes reactive variable
    })
    .catch(error => {
      recipes.value = [] // Clear recipes if error occurs
      console.error('Error fetching recipes:', error) // Log error for debugging
    })
})

// Method: Clear form inputs
function clearForm() {
  firstName.value = ''
  lastName.value = ''
  diet.value = ''
  favoriteIngredient.value = ''
  skillLevel.value = ''
  cookingGoals.value = ''
  newsletterEmail.value = ''
  newsletterMessage.value = ''
}

// Method: Subscribe to newsletter
function subscribeNewsletter() {
  const email = newsletterEmail.value.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  newsletterMessage.value = ''

  if (email && emailRegex.test(email)) {
    newsletterMessage.value = `Thanks for subscribing, ${email}! 🎉`
    newsletterEmail.value = ''
  } else {
    newsletterMessage.value = 'Please enter a valid email address.'
  }
}

// Method: Open recipe detail page
function openRecipeDetail(name) {
  const slug = name.toLowerCase().replace(/\s+/g, '-')
  const url = `/recipe/${slug}`
  window.open(url, '_blank')
}
</script>

<!-- Template for the About page --> 
<template>
  <div class="container mt-5 mb-5">
    <div class="card shadow-lg p-4 border-0">
      <!-- Page Title -->
      <h2 class="text-center mb-3 text-warning">🍽️ About Fathima Cooks & Bakes</h2>
      
      <!-- Description -->
      <p class="text-center text-muted">
        Fathima Cooks & Bakes is a Vue.js app designed to help food lovers discover, share, and enjoy amazing recipes.
      </p>
      <p class="text-center text-muted">
        Whether you're a beginner or a seasoned chef, our platform offers a wide range of recipes, tips, and community support to enhance your culinary journey.
      </p>
      <p class="text-center text-muted">
        Join us in celebrating the joy of cooking and baking, and let's create delicious memories together!
      </p>
      <p class="text-center text-muted">
        <strong>Fathima Cooks & Bakes Team</strong>
      </p>
      <p class="text-center text-muted">
        <strong>Contact:
          <a href="mailto:FathimaCooksandBake.HR@gmail.com">FathimaCooksandBake.HR@gmail.com</a>
        </strong>
      </p>

      <!-- Welcome Message shown if fullName is set -->
      <div v-if="fullName" class="text-center fw-bold fs-2 mt-5 mb-4">
         Welcome, {{ fullName }} 👩‍🍳 !
      </div>

      <!-- Info alert shown if fullName is not set -->
      <div v-else class="alert alert-info text-center mb-4">
        Please fill out the form below to get started.
      </div>

      <!-- Cooking Personalization Form -->
      <form class="mt-4 needs-validation" role="form" aria-label="Cooking personalization form" novalidate @submit.prevent>
        <h3 class="text-center mb-4 fw-bold text-warning">Let's Get Cooking!</h3>
        <p class="text-center text-muted mb-4">
          Share your details to personalize your cooking experience.
        </p>

      <!-- Name Inputs Section -->
      <div class="row" aria-label="Name Input Section">
        <!-- First Name Input -->
        <div class="col-md-6 mb-3">
          <label for="firstName" class="form-label">First Name<span class="text-danger">*</span>:</label>
          <input
            id="firstName"
            type="text"
            v-model.trim="firstName"
            class="form-control"
            placeholder="Enter first name"
            required
            aria-required="true"
          />
        </div>

        <!-- Last Name Input -->
        <div class="col-md-6 mb-3">
          <label for="lastName" class="form-label">Last Name<span class="text-danger">*</span>:</label>
          <input
            id="lastName"
            type="text"
            v-model.trim="lastName"
            class="form-control"
            placeholder="Enter last name"
            required
            aria-required="true"
          />
        </div>
      </div>

      <!-- Diet Preference Radio Buttons -->
      <div class="mb-3">
        <label class="form-label d-block mb-2">Diet Preference<span class="text-danger">*</span>:</label>
        <!-- Vegetarian option -->
        <div class="form-check form-check-inline">
          <input
            type="radio"
            id="veg"
            value="veg"
            v-model="diet"
            class="form-check-input"
            required
            aria-required="true"
            aria-describedby="dietHelp"
          />
          <label class="form-check-label" for="veg">Vegetarian</label>
        </div>

        <!-- Non-Vegetarian option -->
        <div class="form-check form-check-inline">
          <input
            type="radio"
            id="nonveg"
            value="nonveg"
            v-model="diet"
            class="form-check-input"
            aria-describedby="dietHelp"
          />
          <label class="form-check-label" for="nonveg">Non-Vegetarian</label>
        </div>
      </div>

      <!-- Diet Selection Alert -->
      <div class="alert text-center form-check-label" :class="diet ? 'alert-info' : 'alert-warning'">
        {{ diet
          ? `You have selected the ${diet === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'} diet.`
          : 'Please select a diet preference for an image preview.'
        }}
      </div>

      <!-- Image Preview Based on Diet Choice -->
      <div class="text-center mt-4">
        <!-- Show vegetarian image if diet is veg -->
        <img
          v-if="diet === 'veg'"
          src="/assets/veg.jpeg"
          class="img-fluid rounded shadow-sm border border-success"
          style="max-height: 300px;"
          alt="Vegetarian Meal"
        />
      
      <!-- Show non-vegetarian image if diet is npn-veg -->
      <img
        v-if="diet === 'nonveg'"
        src="/assets/nonveg.jpg"
        class="img-fluid rounded shadow-sm border border-danger"
        style="max-height: 300px;"
        alt="Non-Vegetarian Meal"
      />
    </div>

    <!-- Favorite Ingredient Input -->
    <div class="row mt-4">
      <div class="col-md-6 mb-3">
        <label for="ingredient" class="form-label">Favorite Key Ingredient:</label>
        <input
          id="ingredient"
          type="text"
          v-model.trim="favoriteIngredient"
          class="form-control"
          placeholder="e.g., butter, cheese, cinnamon, chicken"
          aria-label="Favorite Ingredient"
          aria-describedby="ingredientHelp"
          aria-required="true"
          required
        />
        <!-- Show alert when favoriteIngredient is filled -->
        <div v-if="favoriteIngredient" class="alert alert-primary text-center mt-2">
          How about trying a recipe with <strong>{{ favoriteIngredient }}</strong> today? 🍳
        </div>
      </div>

      <!-- Cooking Skill Level Select Dropdown -->
      <div class="col-md-6 mb-3">
        <label for="skillLevel" class="form-label">Cooking Skill Level<span class="text-danger">*</span>:</label>
        <select
          id="skillLevel"
          v-model="skillLevel"
          class="form-select"
          required
          aria-required="true"
          aria-describedby="skillLevelHelp"
          aria-label="Select your cooking skill level"
          
        >
          <!-- Placeholder option -->
          <option value="" disabled>Select your skill level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <!-- Skill Level Confirmation Alert --> 
        <div v-if="skillLevel" class="alert alert-secondary text-center mt-2">
          Great! You're an <strong>{{ skillLevel }}</strong> cook. Let's find recipes for you!
        </div>
      </div>
    </div>

    <!-- Cooking Goals Textarea -->
    <div class="mb-3 mt-4">
      <label for="goals" class="form-label">Your Cooking Goals or Favorite Dish:</label>
      <textarea
        id="goals"
        v-model.trim="cookingGoals"
        class="form-control"
        rows="3"
        placeholder="Write something..."
        aria-label="Cooking Goals"
        aria-describedby="goalsHelp"
      ></textarea>
      
      <!-- Display user entered goals -->
      <div v-if="cookingGoals" class="alert alert-light text-center fst-italic mt-2">
        You wrote: "{{ cookingGoals }}"
      </div>
    </div>

    <!-- Personalized Cooking Tip based on skill level-->
    <div v-if="skillLevel" class="alert alert-info text-center mt-3">
      <em>
        {{
          skillLevel === 'Beginner'
            ? '“Cooking is like love. It should be entered into with abandon or not at all.” – Harriet Van Horne'
            : skillLevel === 'Intermediate'
            ? '“Practice, patience, and passion are the secret ingredients to great cooking.”'
            : '“Great cooking favors the brave and the creative.”'
        }}
      </em>
    </div>

    <!-- Recommended Recipes section -->
    <!--Only shows this section if filteredRecipes array has any items.-->
    <div
      v-if="filteredRecipes.length"
      class="mt-4 p-3"
      aria-label="Recommended Recipes Section"
    >
      <h4 class="text-center mb-3 fw-bold text-warning">Recommended Recipes for You</h4>
      <p class="text-muted text-center">Click on a recipe to view details.</p>

      <!-- Recipe Cards -->
       <!--Loop through filteredRecipes-->
      <div class="row g-3">
        <div
          v-for="(recipe, index) in filteredRecipes"
          :key="index"
          class="col-12 col-md-6 col-lg-4"
          role="listitem"
        >
        <!--Entire card is clickable-->
          <div
            class="card h-100 recipe-card list-group-item"
            role="button"
            tabindex="0"
            :aria-label="`View details for recipe: ${recipe.name}, by ${recipe.author}`"
            @click="openRecipeDetail(recipe.name)"
            @keyup.enter="openRecipeDetail(recipe.name)"
            title="Click to view recipe details"
          >
          <div class="card-body px-4 py-3">
            <!-- Recipe Name and Author -->
            <h5 class="card-title fw-semibold mb-1"
              :aria-label="`Recipe name: ${recipe.name}`"
              :title="`Recipe name: ${recipe.name}`">
              {{ recipe.name }}
              <small class="text-muted fst-italic fs-6"
                :aria-label="`Recipe by ${recipe.author}`"
                :title="`Recipe by ${recipe.author}`"
              >by {{ recipe.author }}</small>
            </h5>
            <p class="card-text text-secondary" 
              v-if="recipe.description"
                :aria-label="`Description for ${recipe.name}`"
                :title="`Description for ${recipe.name}`">
                {{ recipe.description }}
            </p>
          </div>

          <!-- Recipe Details container with badges and links -->
          <div class="d-flex flex-wrap gap-2 px-4 py-3">
            <!-- Badge showing number of ingredients, shown only if ingredients exist -->
            <span
              v-if="recipe.ingredients.length"
              class="badge bg-success rounded-pill px-3 py-2"
              :aria-label="`${recipe.ingredients.length} ingredient${recipe.ingredients.length > 1 ? 's' : ''}`"
              :title="`${recipe.ingredients.length} ingredient${recipe.ingredients.length > 1 ? 's' : ''}`"
            >
              <!-- Display ingredient count with pluralization -->
              <!--If there’s more than 1 ingredient, add 's' → becomes "Ingredients"
                    If exactly 1, add nothing → stays "Ingredient"-->
              {{ recipe.ingredients.length }} Ingredient{{ recipe.ingredients.length > 1 ? 's' : '' }}
            </span>
            
            <!-- Badge indicating if the recipe has method steps -->
            <span v-if="recipe.method" class="badge bg-primary rounded-pill px-3 py-2"
              :aria-label="`Method available for ${recipe.name}`"
              :title="`Method available for ${recipe.name}`">
              Method Available
            </span>

            <!-- Link badge to recipe URL if available -->
            <a
              v-if="recipe.url"
              :href="recipe.url"
              class="badge bg-info rounded-pill text-decoration-none px-3 py-2"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
              aria-label="View recipe URL"
              title="View recipe URL"
              :title="`View recipe: ${recipe.name}`"
              :aria-describedby="`recipe-url-${index}`"
            >
              View Recipe
            </a>
            <!-- If no URL is available, show this badge -->
            <span v-else class="badge bg-secondary rounded-pill px-3 py-2">
              No URL
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- If there are no filtered recipes but user entered a favoriteIngredient -->
  <div v-if="!filteredRecipes.length && favoriteIngredient" class="mt-3 alert alert-info text-center">
    Searching for recipes with <strong>{{ favoriteIngredient }}</strong>...
  </div>

  <!-- Clear Form Button -->
  <div class="text-center mt-4">
    <button type="button" class="btn btn-pink" @click="clearForm" aria-label="Clear form" title="Clear all fields">
      <i class="bi bi-x-circle-fill"></i>
      Clear Form
    </button>
  </div>
</form>
</div>

<!-- Newsletter Subscription Section -->
<div class="mt-5 mb-4 card shadow-lg p-4 border-0 ">
  <h4 class="text-center text-warning">📬 Join Our Community Newsletter</h4>
    <p class="text-center">Stay updated with the latest recipes, tips, and community news!</p>
    
    <!-- Email input group with icon -->
    <div class="input-group mb-3 
      justify-content-center">
        <span class="input-group-text" id="subscribeLabel">
          <i class="bi bi-envelope-fill"></i>
        </span>
        <!-- Email input with validation and accessibility attributes -->
        <input
          type="email"
          v-model="newsletterEmail"
          class="form-control"
          placeholder="Enter your email"
          aria-label="Newsletter Email"
          aria-describedby="subscribeButton"
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="Please enter a valid email address."
          id="newsletterEmail"
          aria-required="true"
          :aria-invalid="newsletterMessage && !newsletterMessage.includes('Thanks')"
          :aria-describedby="newsletterMessage ? 'newsletterMessage' : ''"
          :class="{
            'is-invalid': newsletterMessage && !newsletterMessage.includes('Thanks'),
            'is-valid': newsletterMessage && newsletterMessage.includes('Thanks')
          }"
        />

        <!-- Subscribe button triggers subscribeNewsletter method -->
        <button class="btn btn-pink" type="button" @click="subscribeNewsletter" id="subscribeButton">
          <i class="bi bi-envelope-fill"></i>
          Subscribe
        </button>
      </div>

      <!-- Feedback alert message after subscribing or error -->
      <div v-if="newsletterMessage" class="alert text-center" :class="{
        'alert-success': newsletterMessage.includes('Thanks'),
        'alert-danger': newsletterMessage.includes('valid')
      }">
      
      <!-- Icon changes depending on success or error -->
        <i class="bi" :class="{
          'bi-check-circle-fill': newsletterMessage.includes('Thanks'),
          'bi-exclamation-triangle-fill': newsletterMessage.includes('valid')
        }"></i>
        {{ newsletterMessage }}
      </div>
    </div>
  </div>
</template>
