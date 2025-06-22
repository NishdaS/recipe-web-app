<script setup>
import { ref } from 'vue'; // Importing `ref` to create reactive variables
import { useRouter } from 'vue-router'; // Vue Router to programmatically navigate
import { useAuth } from '../composables/useAuth'; // Custom composable for authentication logic

// Initialize the router to use for navigation after login
const router = useRouter();

// Destructure login method from custom authentication composable
const { login } = useAuth();

// Define reactive variables to bind input values and error state
const username = ref('');     // Holds username input
const password = ref('');     // Holds password input
const error = ref('');        // Holds error message (if any)
// the above keeps track of the user's input and login error messages.

// Login handler function, triggered on form submission
function handleLogin() {
  // Call login() from composable with entered credentials
  if (login(username.value, password.value)) {
    router.push('/'); // Redirect to home/dashboard if login is successful
  } else {
    error.value = 'Invalid username or password'; // Show error if login fails
  }
}
</script>

<template>
  <!-- Login Page Container - full height, centered -->
  <div class="login-page d-flex align-items-center justify-content-center min-vh-100 bg-light">
    
    <!-- Card Component for Login Form -->
    <div class="card shadow p-4 rounded-4" style="width: 100%; max-width: 400px;">

      <!-- Header Section -->
      <div class="text-center mb-4">
        <h3 class="fw-bold">Welcome Back</h3>
        <p class="text-muted small">Log in to your account</p>
      </div>

      <!-- Error Message (if login fails) -->
      <div v-if="error" class="alert alert-danger py-2 small text-center">
        {{ error }}
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin">
        <!-- Username Input Field -->
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            v-model="username"           
            class="form-control rounded-pill"
            type="text"
            placeholder="Enter your username"
            required
          />
        </div>

        <!-- Password Input Field -->
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="password"            
            class="form-control rounded-pill"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-pink w-100 rounded-pill py-2 fw-semibold">
          Log In
        </button>

        <!-- Terms and Policy Notice -->
        <div class="text-center mt-2">
          <p class="small text-muted">
            By logging in, you agree to our 
            <a href="#" class="text-decoration-none text-primary">Terms of Service</a> 
            and 
            <a href="#" class="text-decoration-none text-primary">Privacy Policy</a>.
          </p>
        </div>
      </form>

      <!-- Footer Section with Navigation Links -->
      <div class="mt-3 text-center small">
        <!-- Forgot Password -->
        <a href="#" class="text-decoration-none text-muted">Forgot password?</a>

        <!-- Link to Register Page -->
        <p class="mt-2">
          Don't have an account? 
          <router-link to="/register" class="text-decoration-none text-primary">Register</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
