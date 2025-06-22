import { createRouter, createWebHistory } from 'vue-router';

import { defineAsyncComponent } from 'vue';
// Loading and Error Components
const Loading = () => import('../components/LoadingSpinner.vue');
const ErrorFallback = () => import('../components/ErrorFallback.vue');

// Define each lazy-loaded page
// These components will be loaded only when the route is visited
// This is a good practice for performance optimization
// and to reduce the initial bundle size of your application

// Lazy loading components

const Home = defineAsyncComponent({
  loader: () => import('../pages/Home.vue'), // Function to load the component.
  loadingComponent: Loading, //What to show if loading takes time (like a spinner).
  errorComponent: ErrorFallback, //What to show if loading fails.
  delay: 200, //Wait 200ms before showing the loading spinner
  timeout: 5000, //Show error if it takes more than 5 seconds to load.
});

const News = defineAsyncComponent({
  loader: () => import('../pages/News.vue'),
  loadingComponent: Loading,
  errorComponent: ErrorFallback,
  delay: 200,
  timeout: 5000,
});

const About = defineAsyncComponent({
  loader: () => import('../pages/About.vue'),
  loadingComponent: Loading,
  errorComponent: ErrorFallback,
  delay: 200,
  timeout: 5000,
});

const Login = defineAsyncComponent({
  loader: () => import('../pages/Login.vue'),
  loadingComponent: Loading,
  errorComponent: ErrorFallback,
  delay: 200,
  timeout: 5000,
});

const Register = defineAsyncComponent({
  loader: () => import('../pages/Register.vue'),
  loadingComponent: Loading,
  errorComponent: ErrorFallback,
  delay: 200,
  timeout: 5000,
});

const Recipes = defineAsyncComponent({
  loader: () => import('../pages/Recipes.vue'),
  loadingComponent: Loading,
  errorComponent: ErrorFallback,
  delay: 200,
  timeout: 5000,
});

const RecipeDetail = defineAsyncComponent({
  loader: () => import('../pages/RecipeDetail.vue'),  // you can name the file whatever you want
  loadingComponent: Loading,
  errorComponent: ErrorFallback,
  delay: 200,
  timeout: 5000,
});

const Terms = defineAsyncComponent({
  loader: () => import('../pages/Terms.vue'),
  loadingComponent: Loading,
  errorComponent: ErrorFallback,
  delay: 200,
  timeout: 5000,
});

const Privacy = defineAsyncComponent({
  loader: () => import('../pages/Privacy.vue'),
  loadingComponent: Loading,
  errorComponent: ErrorFallback,
  delay: 200,
  timeout: 5000,
});

// Define the routes
// Each route maps to a component
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/news', name: 'news', component: News },
  { path: '/about', name: 'about', component: About },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/recipes', name: 'recipes', component: Recipes },
  { path: '/recipe/:slug', name: 'recipe-detail', component: RecipeDetail }, //dynamic route.
  {path: '/terms', name: 'terms', component:Terms},
  {path: '/privacy', name: 'privacy', component: Privacy},
];

const router = createRouter({
  history: createWebHistory('/cos30043/s104791010/Project/recipe-app/'),
  routes,
});

export default router;