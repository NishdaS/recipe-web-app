// This file sets up the Vue Router for a Vue.js application.
// It imports necessary components and defines routes for the application.

import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import News from '../pages/News.vue';
import About from '../pages/About.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Recipes from '../pages/Recipes.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/news', name: 'news',component: News },
  { path: '/about', name: 'about', component: About },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/recipes', name: 'recipes', component: Recipes },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
