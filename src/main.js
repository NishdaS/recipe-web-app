// Import the main function to create a Vue application
import { createApp } from 'vue'

// Import the root component of your app
import App from './App.vue'

// Import the router configuration to enable page navigation
import router from './router'

// Import Bootstrap CSS and JS for styling and UI components
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import global custom styles (optional, based on your project structure)
import '../style.css'

// Create the Vue application instance, register the router, and mount the app to the DOM
createApp(App)
  .use(router)         // Inject the router into the app
  .mount('#app')       // Mount the app to the <div id="app"> in index.html
