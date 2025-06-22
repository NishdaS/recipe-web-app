
# Fathima Cooks & Bakes 

**Fathima Cooks & Bakes** is a modern and responsive recipe management web app built with **Vue.js 3**, designed for cooking enthusiasts. It allows users to browse, filter, and manage a variety of recipes with features like simulated login, form validation, and client-side state persistence — all without a backend.

---

## Tech Stack

* **Frontend:** Vue 3 (Composition API), Vue Router
* **Styling:** Bootstrap 5, Custom CSS
* **Tooling:** Vite, Vue DevTools
* **State Management:** Vue Refs, Computed Properties
* **Auth:** LocalStorage-based session handling
* **Routing:** SPA navigation with lazy loading and dynamic routes

---

## Key Features

* **Dynamic Routing:** Recipes and pages rendered via dynamic URL slugs
* **Recipe Filtering:** Real-time filtering by cuisine, difficulty, and ingredients
* **Simulated Auth System:** Login, logout, and registration via localStorage
* **Responsive UI:** Optimized for mobile, tablet, and desktop using Bootstrap Grid
* **Custom Pagination:** For large datasets with smooth navigation
* **Form Validation:** Email/password regex-based checks and Bootstrap feedback
* **Accessibility:** ARIA attributes for screen reader compatibility
  
---

## Authentication

This app includes a **custom composable** (`useAuth.js`) that:

- Manages login, logout, and registration
- Stores user sessions in `localStorage`
- Grants recipe editing/deleting access based on user identity
- Persists auth state across browser refreshes  

---

## Setup Instructions

```bash
# Clone the repo
git clone https://github.com/NishdaS/recipe-web-app.git

# Navigate into the directory
cd recipe-web-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## Build for Production

```bash
npm run build
```

---

## Developer Notes

* Uses environment variables like `import.meta.env.BASE_URL` for production deploy compatibility (e.g., GitHub Pages).
* Lazy-loaded views improve initial load time and bundle size.
* Dynamic URL generation ensures SEO-friendly and shareable links.

---

## License

This project is open-sourced for educational and portfolio use. Attribution required if reused or modified.

