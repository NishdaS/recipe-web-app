<script setup>
import { ref, computed, onMounted } from 'vue';       // Import Vue Composition API functions
import { useAuth } from '../composables/useAuth';    // Import a custom auth composable for authentication state

const { isLoggedIn, currentUser } = useAuth();       // Destructure authentication state (login status and user info)

//  Boolean flag to control whether the "Add New Recipe" form is shown.
const showAddRecipeForm = ref(false); //Starts as false, so the form is initially hidden.

// Reactive refs for the new recipe form input fields
const title = ref('');                 // Recipe title input
const description = ref('');           // Recipe description input
const ingredients = ref(['']);         // Ingredients input array, starting with one empty ingredient input
const method = ref(['']);              // Method steps input array, starting with one empty step

// Reactive ref to hold all recipes loaded from JSON
const recipes = ref([]);

// Reactive refs for search and pagination functionality
const searchQuery = ref('');           // Search query string to filter recipes by name, author, etc.
const selectedAuthor = ref('');        // Filter recipes by selected author (in a dropdown)
const currentPage = ref(1);            // Current page number for pagination
const pageSize = 5;                    // Number of recipes to display per page

// Track which recipe is currently in "edit mode" by storing its ID
const editingRecipeId = ref(null); // If null, it means no recipe is being edited.

// Reactive refs for storing the editable inputs when editing a recipe
const editTitle = ref('');             // Editable title input
const editDescription = ref('');       // Editable description input
const editIngredients = ref([]);       // Editable ingredients array
const editMethod = ref([]);             // Editable method steps array

// Function to load recipes from localStorage or fallback to recipes.json
const loadRecipes = async () => {
  try {
    // Try to load recipes from localStorage
    const saved = localStorage.getItem('recipes');

    // If saved recipes exist and are not empty, parse and use them
    if (saved && saved !== '[]') {
      recipes.value = JSON.parse(saved); //This updates your app’s reactive recipe list with saved data.
    } else {
      // Otherwise, fetch recipes from local JSON file (recipes.json)
      const res = await fetch('./recipes.json');
      if (!res.ok) throw new Error('Failed to fetch recipes.json');
      
      // Parse the fetched JSON data
      const data = await res.json();

      // Map the loaded recipes to add missing fields and generate unique IDs if missing
      recipes.value = data.map(r => ({
        ...r,                                   //Spread all original properties
        id: r.id || Date.now() + Math.random(), // Add a unique id if missing (using timestamp plus random number to avoid duplicates).
        Likes: [],                              // Initialize Likes array to empty
        Comments: [],                           // Initialize Comments array to empty
        Ingredients: r.Ingredients || [],      // Ensure Ingredients array exists
        Method: r.Method || []                  // Ensure Method array exists
      }));

      // Save the newly loaded recipes to localStorage- so no laodng from file again
      saveRecipes();
    }
  } catch (error) {
    // If loading fails, log error and clear the recipes list
    console.error('Error loading recipes:', error);
    recipes.value = []; //Clears the recipes reactive array to an empty list to avoid broken UI or stale data if loading fails.
  }
};

// Save recipes to localStorage
const saveRecipes = () => {
  // Convert the recipes array to JSON string and save it in localStorage under the 'recipes' key
  localStorage.setItem('recipes', JSON.stringify(recipes.value));
}; //because the browser storage can only save strings.

// Reset new recipe input fields to initial empty values - when adding a new recipe
const resetNewRecipeFields = () => {
  title.value = '';            // Clear the title input
  description.value = '';      // Clear the description input
  ingredients.value = [''];    // Reset ingredients array with one empty input
  method.value = [''];         // Reset method steps array with one empty input
};

// Add a new recipe to the recipes list - when user submit the form
const addRecipe = () => {
  // Validate required fields: recipe title and description must not be empty or whitespace only
  if (!title.value.trim() || !description.value.trim()) {
    alert('Recipe name and description are required.');
    return; // Exit if validation fails - stops running the function
  }

  // Remove empty ingredient entries by filtering out those that are blank or whitespace only
  const cleanedIngredients = ingredients.value.filter(i => i.trim() !== '');
  // Remove empty method steps similarly
  const cleanedMethod = method.value.filter(m => m.trim() !== '');

  // Validate that there is at least one ingredient and one method step
  if (cleanedIngredients.length === 0 || cleanedMethod.length === 0) {
    alert('At least one ingredient and one method step are required.');
    return; // Exit if validation fails
  }

  // Check for duplicate recipe names by the current user to avoid duplicates
  if (currentUser.value && recipes.value.some(r => r.Author === currentUser.value && r.Name === title.value.trim())) {
    alert('You already have a recipe with this name.');
    return; // Exit if duplicate found
  }

  // Limit the maximum number of recipes to 100 to avoid large localStorage usage
  if (recipes.value.length >= 100) {
    alert('You have reached the maximum number of recipes (100). Please delete some before adding new ones.');
    return; // Exit if limit exceeded
  }

  // Create a new recipe object and add it to the beginning of the recipes array
  recipes.value.unshift({
    id: Date.now(),                 // Generate a unique id using timestamp
    Name: title.value.trim(),       // Recipe name trimmed of whitespace
    Description: description.value.trim(), // Recipe description trimmed of whitespace
    Author: currentUser.value || 'Anonymous', // Author is current logged-in user or 'Anonymous' if none
    url: '',                       // URL is empty by default (can be updated later)
    Ingredients: cleanedIngredients, // Cleaned list of ingredients
    Method: cleanedMethod,          // Cleaned list of method steps
    Likes: [],                     // Initialize empty array for likes
    Comments: []                   // Initialize empty array for comments
  });

  // Save the updated recipes array to localStorage
  saveRecipes();

  // Reset the new recipe form inputs back to empty values
  resetNewRecipeFields();

  // Reset the current page of the paginated recipe list to 1 to show the newest recipe
  currentPage.value = 1;
};

// Delete a recipe (only if current user is the author)
const deleteRecipe = (id) => {
  // Find the recipe in the recipe array by its unique id
  const recipe = recipes.value.find(r => r.id === id);

  // Check if recipe exists and the current user is the author
  if (recipe && recipe.Author === currentUser.value) {
    // Confirm with the user before deleting
    if (confirm('Are you sure you want to delete this recipe?')) {
      // Remove the recipe with the matching id from the recipes array
      recipes.value = recipes.value.filter(r => r.id !== id); // creates a new array with all recipes except the one with the id we want to delete.

      // Save the updated recipes list to localStorage
      saveRecipes();

      // Reset pagination to first page if not already there
      if (currentPage.value > 1) currentPage.value = 1;
    }
  } else {
    // Alert if user tries to delete a recipe they don't own or if recipe not found
    alert('You are not authorized to delete this recipe.');
  }
};

// Start editing a recipe: populate the edit form inputs with the selected recipe's data
const startEditing = (recipe) => {
  editingRecipeId.value = recipe.id;             // Set the editing recipe id to track which recipe is being edited
  editTitle.value = recipe.Name;                  // Populate edit title input
  editDescription.value = recipe.Description;    // Populate edit description input
  editIngredients.value = [...recipe.Ingredients]; // Copy ingredients array into editIngredients (spread to avoid reference issues)
  editMethod.value = [...recipe.Method];          // Copy method steps into editMethod
}; // The ... spread operator creates a new copy of the arrays to avoid modifying the original by mistake.

// Cancel editing and reset edit inputs to empty state
const cancelEditing = () => {
  editingRecipeId.value = null;   // Clear editing recipe id to exit edit mode
  editTitle.value = '';           // Clear edit title input
  editDescription.value = '';     // Clear edit description input
  editIngredients.value = [];     // Clear edit ingredients array
  editMethod.value = [];          // Clear edit method array
};

// Save the edited recipe data back to the recipes list
const saveEdit = (id) => {
  // Validate required fields: name and description must not be empty or whitespace only
  if (!editTitle.value.trim() || !editDescription.value.trim()) {
    alert('Recipe name and description are required.');
    return; // Exit if validation fails
  }

  // Find index(position) of the recipe in the array to be edited by id
  const recipeIndex = recipes.value.findIndex(r => r.id === id);

  // Proceed only if recipe found
  if (recipeIndex !== -1) {
    // Authorization check: only allow editing if current user is the author
    if (recipes.value[recipeIndex].Author !== currentUser.value) {
      alert('You are not authorized to edit this recipe.');
      return; // Exit if unauthorized
    }

    // Remove empty ingredient entries from editIngredients
    const cleanedIngredients = editIngredients.value.filter(i => i.trim() !== '');
    // Remove empty method steps from editMethod
    const cleanedMethod = editMethod.value.filter(m => m.trim() !== '');

    // Update the recipe in place, preserving other fields, but updating editable fields
    recipes.value[recipeIndex] = {
      ...recipes.value[recipeIndex],          // Keep existing properties
      Name: editTitle.value.trim(),           // Update name
      Description: editDescription.value.trim(), // Update description
      Ingredients: cleanedIngredients,        // Update cleaned ingredients
      Method: cleanedMethod,                   // Update cleaned method steps
    };

    // Save updated recipes list to localStorage
    saveRecipes();

    // Exit edit mode and clear edit inputs
    cancelEditing();
  }
};

// Toggle like/unlike for a recipe by the current user
const toggleLike = (recipe) => {
  // Do nothing if user is not logged in
  if (!currentUser.value) return; //  prevents guests from liking recipes.

  // Check if current user has already liked the recipe
  const index = recipe.Likes.indexOf(currentUser.value);

  if (index === -1) {
    // If not liked yet, add current user's name to Likes array
    recipe.Likes.push(currentUser.value);
  } else {
    // If already liked, remove the user from Likes array (unlike)
    recipe.Likes.splice(index, 1);
  }

  // Save updated recipes list to localStorage
  saveRecipes();
};

// *Check if the current user has liked a particular recipe
const hasLiked = (recipe) => 
  currentUser.value && recipe.Likes.includes(currentUser.value);

// Reactive object to store new comment input for each recipe by recipe id
const newComments = ref({});

// Add a comment to a recipe
const addComment = (recipe) => {
  // Get the new comment text for this recipe
  const comment = newComments.value[recipe.id];

  // Only proceed if comment exists and is not just whitespace
  if (comment && comment.trim()) {
    // Push a new comment object to the recipe's Comments array
    recipe.Comments.push({
      user: currentUser.value || 'Anonymous',       // Set user or 'Anonymous'
      text: comment.trim(),                          // Trimmed comment text
      timestamp: new Date().toISOString()            // Current ISO timestamp
    });

    // Clear the comment input for this recipe
    newComments.value[recipe.id] = '';

    // Save updated recipes list to localStorage
    saveRecipes();
  }
};

// Delete a comment from a recipe (only if current user is the author of that comment)
const deleteComment = (recipe, commentIndex) => {
  // Check if current user is the author of the comment
  if (recipe.Comments[commentIndex].user === currentUser.value) {
    // Remove the comment at the given index from Comments array
    recipe.Comments.splice(commentIndex, 1);

    // Save updated recipes list to localStorage
    saveRecipes();
  }
};

// Computed property to get a sorted list of unique authors from all recipes
const uniqueAuthors = computed(() => {
  // Use a Set to get unique authors
  // Extracts all authors from the recipes using .map() and puts them into a JavaScript Set, which removes duplicates automatically.
  const authorsSet = new Set(recipes.value.map(r => r.Author));

  // Convert Set back to array and sort alphabetically
  return Array.from(authorsSet).sort();
});

// Computed property for filtering recipes based on search query and selected author
const filteredRecipes = computed(() => {
  // Starts with the full list of all recipes.
  let filtered = recipes.value;

  // Normalize search query by trimming and lowercasing
  const query = searchQuery.value.trim().toLowerCase();

  // Filter by recipe name if search query exists
  if (query) {
    filtered = filtered.filter(recipe =>
      (recipe.Name ?? '').toLowerCase().includes(query)
    ); // Uses optional chaining with ?? '' to avoid errors if recipe.Name is undefined.
  }

  // Filter by author if an author is selected
  if (selectedAuthor.value) {
    filtered = filtered.filter(recipe => recipe.Author === selectedAuthor.value);
  }

  return filtered;
});

// Computed property for total number of pages based on filtered recipes and page size
const totalPages = computed(() => 
  Math.ceil(filteredRecipes.value.length / pageSize)
);

// Computed property for paginated recipes for the current page
const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  // Return a slice of filtered recipes corresponding to current page
  return filteredRecipes.value.slice(start, start + pageSize);
});

// Change the current page, validating the requested page number
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page; // so that paginatedRecipes updates.
  }
};

// Utility function to convert timestamp into "time ago" format (e.g., 5m ago, 2h ago)
const timeAgo = (timestamp) => {
  // Calculate elapsed seconds since timestamp
  const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000);

  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// Load recipes when the component is mounted
onMounted(loadRecipes);
</script>

<template>
  <div class="container">
    <!-- Header Section -->
    <div class="text-center mt-5">
      <h1 class="text-warning">Welcome to the Recipe Book 🍝 </h1>
      <p class="text-muted">
        Discover and share your favorite recipes with the community!
        Scroll to the bottom to add your very own recipe
      </p>
    </div>

    <!-- Only show recipe content if user is logged in -->
    <div v-if="isLoggedIn">

      <!-- Filters: Search and Author Filter -->
      <div class="mb-4 d-flex justify-content-center flex-wrap gap-3">
        <!-- Search Input -->
        <div class="col-auto">
          <input
            v-model="searchQuery"
            type="search"
            class="form-control"
            placeholder="Search recipes..."
            aria-label="Search recipes"
          />
        </div>

        <!-- Dropdown for Filtering by Author -->
        <div class="col-auto">
          <select
            v-model="selectedAuthor"
            class="form-select"
            aria-label="Filter by author"
          >
            <option value="">All Authors</option>
            <option
              v-for="author in uniqueAuthors"
              :key="author"
              :value="author"
            >
              {{ author }}
            </option>
          </select>
        </div>
      </div>

      <!-- Recipe List -->
      <div v-if="paginatedRecipes.length">
        <!-- Loop through each recipe in the current page and display -->
        <div
          v-for="recipe in paginatedRecipes"
          :key="recipe.id"
          class="card mb-4"
          :aria-label="'Recipe: ' + recipe.Name"
        >
          <div class="card-body">
            <!-- If currently editing this recipe -->
            <div v-if="editingRecipeId === recipe.id">
              <!-- Edit Recipe Name -->
              <div class="mb-2">
                <label class="form-label" for="editTitle">Recipe Name</label>
                <input id="editTitle" v-model="editTitle" class="form-control" />
              </div>

              <!-- Edit Recipe Description -->
              <div class="mb-2">
                <label class="form-label" for="editDescription">Description</label>
                <textarea id="editDescription" v-model="editDescription" rows="2" class="form-control"></textarea>
              </div>

              <!-- Edit Ingredients -->
              <div class="mb-2">
                <label class="form-label">Ingredients</label>
                  <!-- Loop through each editable ingredient -->
                  <div v-for="(ing, idx) in editIngredients" :key="'edit-ing-'+idx" class="input-group mb-1">
                    <!-- Input field bound to the current ingredient -->
                    <input v-model="editIngredients[idx]" class="form-control" />
                    <!-- Remove button for each ingredient -->
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="editIngredients.splice(idx, 1)"
                      :disabled="editIngredients.length === 1"
                      aria-label="Remove ingredient"
                    >
                      &times;
                    </button>
                  </div>

                  <!-- Button to add a new ingredient field -->
                  <button
                    class="btn btn-sm btn-outline-primary"
                    type="button"
                    @click="editIngredients.push('')"
                  >
                    + Add Ingredient
                  </button>
                </div>

                <!-- Edit Method -->
                <div class="mb-2">
                  <label class="form-label">Method</label>
                  <!-- Loop through each editable method step -->
                  <div v-for="(step, idx) in editMethod" :key="'edit-method-'+idx" class="input-group mb-1">
                    <!-- Input field bound to the current method step -->
                    <input v-model="editMethod[idx]" class="form-control" />
                    <!-- Remove button for each step -->
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="editMethod.splice(idx, 1)"
                      :disabled="editMethod.length === 1"
                      aria-label="Remove method step"
                    >
                      &times;
                    </button>
                  </div>

                  <!-- Button to add a new method step -->
                  <button
                    class="btn btn-sm btn-outline-pink"
                    type="button"
                    @click="editMethod.push('')"
                  >
                    + Add Step
                  </button>
                </div>

                <!-- Save and Cancel Buttons -->
                <button class="btn btn-success me-2" @click="saveEdit(recipe.id)">Save</button>
                <button class="btn btn-secondary" @click="cancelEditing">Cancel</button>
              </div>

              <!-- Display Mode (non-editing view) -->
              <div v-else class= "mb-4">
                <div class="card-body">
                  <div class="row">
                    <!-- Left column: Text content of recipe -->
                    <div class="col-12 col-md-8">
                      <!-- Recipe Title -->
                      <h5 class="card-title fw-bold text-warning">{{ recipe.Name }}</h5>
                      <!-- Recipe Description -->
                      <p class="card-text text-muted mb-2">{{ recipe.Description }}</p>
                      <!-- Author Badge -->
                      <p class="mb-3">
                        <strong>Author:</strong>
                        <span class="badge bg-info mx-2">{{ recipe.Author }}</span>
                      </p>
                      <!-- Display Ingredients if available -->
                      <div v-if="recipe.Ingredients && recipe.Ingredients.length" class="mb-3">
                        <h6 class="text-success fw-bold mt-5 mb-3">Ingredients:</h6>
                        <ul class="list-group list-group-flush">
                          <li
                            v-for="(ing, i) in recipe.Ingredients"
                            :key="'ing-'+i"
                            class="list-group-item py-1 px-2"
                          >
                            {{ ing }}
                          </li>
                        </ul>
                      </div>

                      <!-- Display Method steps if available -->
                      <div v-if="recipe.Method && recipe.Method.length">
                        <h6 class="text-success fw-bold mt-5 mb-3">Method:</h6>
                        <ol class="ps-3">
                          <li
                            v-for="(step, i) in recipe.Method"
                            :key="'step-'+i"
                            class="mb-1"
                          >
                            {{ step }}
                          </li>
                        </ol>
                      </div>
                    </div>

                    <!-- Authorization Controls -->
                    <div class="mt-2">
                      <!-- Check if currentUser exists AND is the author of the recipe -->
                      <template v-if="currentUser && recipe.Author === currentUser">
                        <!-- If both are true, it shows the Edit and Delete buttons.-->
                        <!-- Edit Button -->
                        <button
                          class="btn btn-sm btn-warning me-2 mb-3"
                          @click="startEditing(recipe)"        
                          aria-label="Edit recipe"
                        >
                          Edit
                        </button>

                        <!-- Delete Button -->
                        <button
                          class="btn btn-sm btn-danger mb-3"
                          @click="deleteRecipe(recipe.id)"    
                          aria-label="Delete recipe"
                        >
                          Delete
                        </button>
                      </template>
                      
                      <!-- If current user is not the author -->
                      <template v-else>
                        <small class="text-danger fw-bold">
                          You are not authorized to edit or delete this recipe.
                        </small>
                      </template>
                    </div>

                    <!-- Likes and Comments -->
                    <div class="d-flex align-items-center gap-3 mt-3 mb-3">
                      <button
                        v-if="isLoggedIn"
                        class="like-btn"
                        @click="toggleLike(recipe)"
                        aria-label="Like recipe"
                      >
                        <i
                          :class="hasLiked(recipe) ? 'bi bi-hand-thumbs-up-fill' : 'bi bi-hand-thumbs-up'"
                          aria-hidden="true"
                        ></i>
                        {{ hasLiked(recipe) ? 'Unlike' : 'Like' }}
                      </button>
                      <span class="likes-count">
                        {{ recipe.Likes.length }} like{{ recipe.Likes.length !== 1 ? 's' : '' }}
                      </span>
                    </div>

                    <!-- comments section-->
                    <div class="mt-3">
                      <!-- Heading with dynamic count of comments -->
                      <h6>Comments ({{ recipe.Comments.length }})</h6>
                      <!-- List of comments -->
                      <ul class="list-group">
                        <!-- Loop through each comment in recipe.Comments -->
                        <li
                          v-for="(comment, index) in recipe.Comments"
                          :key="index"
                          class="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <!-- Display the commenter's username in bold -->
                            <strong>{{ comment.user }}</strong>:
                            <!-- Display the comment text -->
                            <span>{{ comment.text }}</span>
                            <br />
                            <!-- Show relative time since comment was posted -->
                            <small class="text-muted">{{ timeAgo(comment.timestamp) }}</small>
                          </div>
                          
                          <!-- Show delete button only if the comment belongs to the current user -->
                          <button
                            v-if="comment.user === currentUser"
                            class="btn btn-sm btn-link text-danger p-0 ms-2"
                            @click="deleteComment(recipe, index)"
                            aria-label="Delete comment"
                          >
                          <i class="bi bi-trash"></i>
                        </button>
                      </li>
                    </ul>
                    <!-- Comment Input Section: Only visible if user is logged in -->
                    <div v-if="currentUser" class="mt-2">
                      <!-- Text input for new comment, bound to newComments keyed by recipe id -->
                      <input
                        v-model="newComments[recipe.id]"
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="Add comment..."
                        @keyup.enter="addComment(recipe)"
                        aria-label="Add comment"
                      />
                      <!-- Button to add the new comment -->
                      <button class="btn btn-sm btn-pink mt-1" @click="addComment(recipe)">
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Controls: Only shown if there are multiple pages -->
        <nav
          v-if="totalPages > 1"
          aria-label="Recipe pagination"
          class="d-flex justify-content-center align-items-center mt-4 gap-3"
        >
          <!-- Previous Page Button: Disabled if on first page -->
          <button
            class="btn btn-outline-pink"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            aria-label="Previous page"
          >
            ← Previous
          </button>

          <!-- Page Number Buttons -->
          <ul class="pagination mb-0">
            <!-- Loop through totalPages to create page buttons -->
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
            <button
                class="page-link text-pink px-2 py-1"
                @click="goToPage(page)"
                :aria-current="currentPage === page ? 'page' : null"
              >
                {{ page }}
              </button>
            </li>
          </ul>

          <!-- Next Page Button: Disabled if on last page -->
          <button
            class="btn btn-outline-pink px-4 py-2"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            aria-label="Next page"
          >
           → Next 
          </button>
        </nav>
        </div>

        <!-- No recipes found message -->
        <div v-else class="alert alert-info" role="alert" aria-live="polite">
          No recipes found.
        </div>

        <!-- Add New Recipe Form: Only shown if user is logged in -->
        <div v-if="isLoggedIn" class="mb-5 ">
          <!-- Heading and descriptive text -->
          <h3 class="text-center text-warning mt-5">Add Your Own Recipe 🍴</h3>
          <p class="text-center text-muted">
            Share your culinary creations with the world! 
            Click the button below to add your own recipe.
          </p>
      
          <!-- Button to show the Add Recipe form -->
          <div v-if="!showAddRecipeForm" class="text-center">
            <button
              class="btn btn-pink mt-3 mb-3"
              type="button"
              aria-label="Add new recipe"
              @click="showAddRecipeForm = true"
            >
              Add Recipe
            </button>
          </div>

          <!-- Add Recipe Form: Visible when showAddRecipeForm is true -->
          <div v-else class="p-3 border rounded bg-light mt-3">
            <!-- The same form content you had before -->
             <!-- Recipe Name Input -->
            <div class="mb-2">
              <label class="form-label mt-3" for="newTitle">Recipe Name</label>
              <input
                id="newTitle"
                v-model="title"
                class="form-control"
                placeholder="Enter recipe name"
                aria-label="Recipe name"
                required
                autofocus
              />
            </div>

            <!-- Recipe Description Textarea -->
            <div class="mb-2">
              <label class="form-label mt-3" for="newDescription">Description</label>
              <textarea
                id="newDescription"
                v-model="description"
                rows="2"
                class="form-control"
                placeholder="Brief description"
                aria-label="Recipe description"
                required
              ></textarea>
            </div>

            <!-- Ingredients lists inputs -->
            <div class="mb-2">
              <label class="form-label mt-3">Ingredients</label>
              <!-- Loop through ingredients array to create inputs -->
              <div
                v-for="(ing, idx) in ingredients"
                :key="'ing-'+idx"
                class="input-group mb-1"
              >
                <input
                  v-model="ingredients[idx]"
                  class="form-control"
                  placeholder="Ingredient"
                  aria-label="Ingredient"
                />

                <!-- Button to remove an ingredient, disabled if only one left -->
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="ingredients.splice(idx, 1)"
                  :disabled="ingredients.length === 1"
                  aria-label="Remove ingredient"
                >
                  &times;
                </button>
              </div>
              <button
                class="btn btn-sm btn-outline-primary mt-2"
                type="button"
                @click="ingredients.push('')"
              >
                + Add Ingredient
              </button>
            </div>

            <!-- Method inputs -->
            <div class="mb-2">
              <label class="form-label mt-3">Method</label>
               <!-- Loop through method steps array -->
              <div
                v-for="(step, idx) in method"
                :key="'method-'+idx"
                class="input-group mb-1"
              >
                <input
                  v-model="method[idx]"
                  class="form-control"
                  placeholder="Step"
                />

                <!-- Button to remove a method step, disabled if only one left -->
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="method.splice(idx, 1)"
                  :disabled="method.length === 1"
                  aria-label="Remove method step"
                >
                  &times;
                </button>
              </div>
              <!-- Button to add a new method step -->
              <button
                class="btn btn-sm btn-outline-primary mt-2"
                type="button"
                @click="method.push('')"
              >
                + Add Step
              </button>
            </div>

          <!-- Buttons to Add Recipe or Cancel -->
          <button
            class="btn btn-success mt-2 me-2"
            @click="() => { addRecipe(); showAddRecipeForm = false; }"
          >
            Add Recipe
          </button>
          <button
            class="btn btn-secondary mt-2"
            @click="() => { showAddRecipeForm = false; resetNewRecipeFields(); }"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Message shown if user is not logged in -->
    <div v-else class="alert alert-warning mt-4 text-center">
      Please log in to view and interact with recipes.
    </div>
  </div>
</template>
