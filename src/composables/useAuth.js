/**
 * useAuth composable - manages simple client-side authentication state using Vue's reactivity system
 * and browser localStorage for persistence.
 *
 * This composable provides reactive references and functions for:
 * - Registering a new user (stores username and password in localStorage)
 * - Logging in a user (checks credentials and sets logged-in state)
 * - Logging out a user (clears login state)
 * - Accessing current user info and login status reactively
 *
 */

import { ref } from 'vue';

// Reactive state for logged-in status and current user, initialized from localStorage
const isLoggedIn = ref(localStorage.getItem('loggedIn') === 'true');
const currentUser = ref(localStorage.getItem('currentUser') || '');

// Reactive users object loaded from localStorage (username: password)
const users = ref(JSON.parse(localStorage.getItem('users') || '{}'));

// Helper: persist the users object to localStorage
function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users.value));
}

/**
 * Register a new user by username and password
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean} true if registration successful, false if user exists
 */
function register(username, password) {
  if (users.value[username]) {
    return false; // User already exists
  }
  users.value[username] = password;
  saveUsers();
  return true;
}

/**
 * Attempt to login with username and password
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean} true if login successful, false otherwise
 */
function login(username, password) {
  if (users.value[username] === password) {
    isLoggedIn.value = true;
    currentUser.value = username;
    localStorage.setItem('loggedIn', 'true');    // Persist login state
    localStorage.setItem('currentUser', username);
    return true;
  }
  return false;
}

/**
 * Logout the current user and clear localStorage login data
 */
function logout() {
  isLoggedIn.value = false;
  currentUser.value = '';
  localStorage.removeItem('loggedIn');    // Clear persisted login state
  localStorage.removeItem('currentUser');
}

/**
 * Expose auth state and functions as a composable
 */
export function useAuth() {
  return {
    isLoggedIn,
    currentUser,
    register,
    login,
    logout,
  };
}
