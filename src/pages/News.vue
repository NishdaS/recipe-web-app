<script setup>
// Import Vue composition API functions
import { ref, computed, watch } from 'vue'

// Import news data from local JSON file
import newsData from '../../src/news.json'

// Import custom authentication logic
import { useAuth } from '../composables/useAuth'

// Access the login state from the authentication composable
const { isLoggedIn: userLoggedIn } = useAuth()

// Define reactive variables for search input, category filter, and date filter
// Load initial values from localStorage for persistence
const searchQuery = ref(localStorage.getItem('searchQuery') || '')
const selectedCategory = ref(localStorage.getItem('selectedCategory') || '')
const searchDate = ref(localStorage.getItem('searchDate') || '')

// Pagination control variables
const currentPage = ref(1)
const itemsPerPage = 6

// Reset (pagination) current page to 1 whenever the search query or selected category changes
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

// With persistence: The filters (search text, category, date) remain exactly as the user left them, improving continuity.
// Persist search query to localStorage on change
watch(searchQuery, (newVal) => {
  localStorage.setItem('searchQuery', newVal)
})

// Persist selected category to localStorage on change
watch(selectedCategory, (newVal) => {
  localStorage.setItem('selectedCategory', newVal)
})

// Persist selected date to localStorage on change
watch(searchDate, (newVal) => {
  localStorage.setItem('searchDate', newVal)
})

// Compute a list of unique categories from the news data (for the dropdown)
const uniqueCategories = computed(() => {
  const categories = newsData.map(news => news.category)
  return [...new Set(categories)]
})

// Compute the filtered list of news based on search query, category, and date
const filteredNews = computed(() => {
  let results = newsData

  // Filter by search query (applies to title, content, category, or date)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    results = results.filter(item =>
      item.date.includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  }

  // Filter by selected category
  if (selectedCategory.value) {
    results = results.filter(item => item.category === selectedCategory.value)
  }

  // Filter by selected date
  if (searchDate.value) {
    results = results.filter(item => item.date === searchDate.value)
  }

  return results
})

// PAGINATION LOGIC 

// Compute the total number of pages for pagination after filter
const totalPages = computed(() =>
  Math.ceil(filteredNews.value.length / itemsPerPage)
)

// Compute the news items to be displayed on the current page
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredNews.value.slice(start, start + itemsPerPage)
})

// Alias for displayed news (optional abstraction)
const displayedNews = computed(() => paginatedNews.value)

// Move to the next page if not at the end
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Move to the previous page if not at the beginning
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

// Reset all filters and pagination, and clear localStorage
function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  searchDate.value = ''

  localStorage.removeItem('searchQuery')
  localStorage.removeItem('selectedCategory')
  localStorage.removeItem('searchDate')

  currentPage.value = 1
}
</script>

<template>
  <div class="container mx-auto mt-5 news-page">
    <h2 class="text-center mb-3 text-warning">📰 Cooking News & Tips</h2>
    
    <!-- Conditional rendering: show content only if the user is logged in -->
    <div v-if="userLoggedIn">
      <p class="text-center text-muted mb-4">
        Stay updated with the latest in the world of food!
      </p>

      <!-- Search Input (centered) -->
      <div class="row mb-3">
        <div class="col-md-8 mx-auto">
          <div class="input-group shadow-sm">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="🔍 Search news by title, category, or keywords..."
            />
            <!-- Button to clear the search input -->
            <button class="btn btn-outline-pink" @click="searchQuery = ''">Clear</button>
          </div>
        </div>
      </div>

      <!-- Category & Date side-by-side -->
      <div class="row mb-3 justify-content-center">
        <div class="col-md-4">
          <select class="form-select shadow-sm" v-model="selectedCategory">
            <!-- Dynamically generate options from unique categories -->
            <option value="">All Categories</option>
            <option
              v-for="category in uniqueCategories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Date Filter Picker -->
        <div class="col-md-4 mt-3 mt-md-0">
          <input
            type="date"
            class="form-control shadow-sm"
            v-model="searchDate"
          />
        </div>
      </div>

      <!-- Reset Filters Button -->
      <div class="row mb-4">
        <div class="col-md-8 mx-auto d-flex justify-content-end">
          <button class="btn btn-outline-pink" @click="resetFilters">
            <i class="bi bi-x-circle-fill"></i>
            Reset All Filters
          </button>
        </div>
      </div>

      <!-- News Cards -->
      <div class="row g-4">
        <!-- Render each news item as a card -->
        <div
          class="col-md-6"
          v-for="news in displayedNews"
          :key="news.id"
        >
          <div class="card h-100 shadow-sm border-0 rounded-3" style="border-radius: 1rem;">
            <div class="card-body p-4">
              <h5 class="card-title fs-5 fw-bold">{{ news.title }}</h5>
              <h6 class="card-subtitle mb-2 text-muted fs-6">
                {{ news.date }} | {{ news.category }}
              </h6>
              <p class="card-text fs-6">{{ news.content }}</p>
              <!-- External link to full article -->
              <a
                :href="news.url || '#'"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline-primary"
              >
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>


      <!-- Message shown when no results match filters -->
      <div v-if="displayedNews.length === 0" class="text-center text-muted mt-4">
        No news found for the selected filters.
      </div>

      <!-- Pagination -->
      <div
        v-if="displayedNews.length > 0 && totalPages > 1"
        class="d-flex justify-content-center align-items-center mt-4 gap-3"
      >
        <!-- Previous Page Button -->
        <button @click="prevPage" class="btn btn-outline-pink" :disabled="currentPage === 1">
          ← Previous
        </button>
        <!-- Current Page Indicator -->
        <span class="text-muted">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" class="btn btn-outline-pink" :disabled="currentPage === totalPages">
          Next →
        </button>
      </div>
    </div>

    <!-- Message for users who are not logged in -->
    <div v-else class="text-center text-muted mt-4">
      Please <router-link to="/login" class="text-decoration-none">log in</router-link> to view the latest news and tips.
    </div>
  </div>
</template>
