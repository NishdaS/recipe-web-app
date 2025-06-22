<script setup>

// Import necessary functions and hooks from Vue and Vue Router
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

// Create a router instance to programmatically navigate pages
const router = useRouter();
// Import the authentication composable to handle registration
const { register } = useAuth();

// Define reactive variables for form fields and validation
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const username = ref(''); // Auto-generated username based on first and last name
const error = ref(''); // Error message for validation or registration issues
const success = ref(false); // boolean Flag to show success message

// Watch for changes in firstName and lastName to auto-generate the username
watch([firstName, lastName], () => {
  username.value = (firstName.value + lastName.value)
    .toLowerCase()
    .replace(/\s/g, ''); // Remove spaces and convert to lowercase
});

// Regular expression patterns for validation
const namePattern = /^[A-Za-z0-9]{1,20}$/; // Allows letters and numbers, 1 to 20 characters 
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // email format
const phonePattern = /^\+\d{1,3}\d{10}$/; // International format like +11234567890
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
// Password must have uppercase, lowercase, number, special char, min 8 chars

// Computed property to check if the entire form is valid
const isFormValid = computed(() => {
  return (
    // Check if all fields are filled and valid
    namePattern.test(firstName.value) &&
    namePattern.test(lastName.value) &&
    emailPattern.test(email.value) &&
    phonePattern.test(phone.value) &&
    passwordPattern.test(password.value) &&
    password.value === confirmPassword.value // the confirmation password must match the entered password.
  );
});

// Submit handler for the registration form
async function handleRegister() {
  // If form is not valid, show error and stop
  if (!isFormValid.value) {
    error.value = 'Please correct the highlighted fields.';
    success.value = false;
    return;
  }

  try {
    // Call register function (useAuth composable handles registration logic)
    const registered = await register(username.value, password.value);
    // If registration is successful, redirect to login page
    // If registration fails, it should return false or throw an error
    if (registered) {
      success.value = true;
      error.value = '';
      // Redirect to login page after successful registration
      router.push('/login');
    } else {
       // If registration fails due to duplicate username
      error.value = 'Username already exists';
      success.value = false;
    }
  } catch (err) {
    // Handle any errors that occur during registration
    // This could be a network error or server-side validation error
    error.value = 'Registration failed. Try again.';
    success.value = false;
    console.error(err);
  }
}
</script>
<template>
  <!-- Register Page Container: vertically centered full-height view -->
  <div class="register-page d-flex align-items-center justify-content-center min-vh-100">

    <!-- Card container with shadow and padding -->
    <div class="card shadow p-4 rounded-4" style="width: 100%; max-width: 500px;">

      <!-- Header and success message -->
      <div class="text-center mb-3">
        <h3 class="fw-bold">Create Account</h3>
        <p class="text-muted small">Join us to explore delicious recipes</p>

        <!-- Show success alert if registration was successful -->
        <p v-if="success" class="alert alert-success py-2 small text-center">
          Registration successful! Please log in.
        </p>
      </div>

      <!-- Show error message if there's any error -->
      <div v-if="error" class="alert alert-danger py-2 small text-center">
        {{ error }}
      </div>

      <!-- Registration form -->
      <form @submit.prevent="handleRegister" novalidate> <!--When the form is submitted, the handleRegister method is called, and the default form submission behavior is prevented.-->

        <!-- First Name input with validation -->
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name *</label>
          <input
            id="firstName"
            v-model="firstName"
            :class="['form-control rounded-pill', firstName && !namePattern.test(firstName) ? 'is-invalid' : '']"
            placeholder="Enter your first name"
            required
            aria-label="First Name"
            aria-describedby="firstNameHelp"
          />
          <!-- when is-invalid class is present.-->
          <div class="invalid-feedback">
            First name must be 1-20 alphabetic numeric characters.
          </div>
        </div>

        <!-- Last Name input with validation -->
        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name *</label>
          <input
            id="lastName"
            v-model="lastName"
            :class="['form-control rounded-pill', lastName && !namePattern.test(lastName) ? 'is-invalid' : '']"
            placeholder="Enter your last name"
            required
            aria-label="Last Name"
            aria-describedby="lastNameHelp"
          />
          <div class="invalid-feedback">
            Last name must be 1-20 alphabetic or numeric characters.
          </div>
        </div>

        <!-- Email input with regex-based validation -->
        <div class="mb-3">
          <label for="email" class="form-label">Email *</label>
          <input
            id="email"
            v-model="email"
            type="email"
            :class="['form-control rounded-pill', email && !emailPattern.test(email) ? 'is-invalid' : '']"
            placeholder="a123@gmail.com"
            required
            aria-label="Email"
            aria-describedby="emailHelp"
          />
          <div class="invalid-feedback">
            Please enter a valid email address.
          </div>
        </div>

        <!-- Phone input with validation for international format -->
        <div class="mb-3">
          <label for="phone" class="form-label">Phone Number *</label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            :class="['form-control rounded-pill', phone && !phonePattern.test(phone) ? 'is-invalid' : '']"
            placeholder="+11234567890"
            required
            aria-label="Phone Number"
            aria-describedby="phoneHelp"
          />
          <div class="invalid-feedback">
            Use international format like +11234567890.
          </div>
        </div>

        <!-- Auto-generated Username (readonly field) -->
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            v-model="username"
            class="form-control rounded-pill"
            readonly
            placeholder="Auto-generated username"
            aria-label="Username"
            aria-describedby="usernameHelp"
          />
        </div>

        <!-- Password input with strength validation -->
        <div class="mb-3">
          <label for="password" class="form-label">Password *</label>
          <input
            id="password"
            v-model="password"
            type="password"
            :class="['form-control rounded-pill', password && !passwordPattern.test(password) ? 'is-invalid' : '']"
            placeholder="Create a strong password"
            required
            aria-label="Password"
            aria-describedby="passwordHelp"
          />
          <!-- Password strength guidance -->
          <div class="form-text text-muted small">
            Must include uppercase, lowercase, number, special character, min 8 characters.
          </div>
          <div class="invalid-feedback">
            Password doesn't meet strength requirements.
          </div>
        </div>

        <!-- Confirm Password input with match validation -->
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password *</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            :class="['form-control rounded-pill', confirmPassword && confirmPassword !== password ? 'is-invalid' : '']"
            placeholder="Re-enter your password"
            required
            aria-label="Confirm Password"
            aria-describedby="confirmPasswordHelp"
          />
          <div class="invalid-feedback">
            Passwords do not match.
          </div>
        </div>

        <!-- Submit/Register button (disabled unless form is valid) -->
        <button
          type="submit"
          class="btn-pink w-100 rounded-pill py-2 fw-semibold"
          :disabled="!isFormValid" 
          aria-label="Register"
          @click="handleRegister"
          style="cursor: pointer;"
        >
          Register
        </button>

        <!-- Feedback messages -->
        <div v-if="success" class="text-success small text-center mt-2">
          Registration successful! Please log in.
        </div>
        <div v-if="error" class="text-danger small text-center mt-2">
          {{ error }}
        </div>

        <!-- Terms and Privacy links -->
        <div class="text-center mt-2 small text-muted">
          By registering, you agree to our
          <router-link to="/terms" class="text-decoration-none text-primary">Terms</router-link> and
          <router-link to="/privacy" class="text-decoration-none text-primary">Privacy Policy</router-link>.
        </div>
      </form>

      <!-- Link to login if already registered -->
      <div class="mt-3 text-center small">
        <p>
          Already have an account?
          <router-link to="/login" class="text-decoration-none text-primary">Log In</router-link>
        </p>
      </div>

    </div>
  </div>
</template>
