// Import the defineConfig helper function from Vite for type-safe configuration
import { defineConfig } from 'vite'

// Import the official Vue plugin for Vite to handle Vue single-file components (.vue)
import vue from '@vitejs/plugin-vue'

// Import Node.js path module to handle directory paths easily
import path from 'path'

// Export Vite configuration using defineConfig for better IDE support and validation
export default defineConfig({
  // Base public path when served in production.
  // Useful if your app is hosted in a subdirectory (e.g. GitHub Pages)
  base: '/cos30043/s104791010/Project/recipe-app/',

  // Register plugins to extend Vite functionality
  plugins: [
    vue(), // Enable Vue support
  ],

  // Resolve configuration helps to configure path aliases
  resolve: {
    alias: {
      // Alias '@' to the 'src' directory for cleaner imports in your project files
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
