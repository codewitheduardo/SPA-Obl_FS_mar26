# 🍳 CookBook – Recipe Management SPA

A modern **Single Page Application** developed with **React** for creating, organizing, discovering, and sharing recipes.

CookBook allows users to manage their own recipes, explore international dishes from **TheMealDB**, save favorites, interact through comments, and generate new recipe ideas using **artificial intelligence**.

This frontend was developed as part of an academic **Full Stack project** and communicates with a separate REST API.

---

## 📌 Description

CookBook is a digital recipe management platform designed for two different user roles:

- **Chef:** can create, edit, delete, and publish recipes and categories.
- **Reader:** can explore recipes, leave comments, save external favorites, and generate recipe ideas with AI.

The application includes protected routes, centralized state management, reusable components, form validation, responsive layouts, and integration with external services.

---

## 🚀 Main Features

### 🔐 Authentication and Authorization

- User registration and login
- JWT-based authentication
- Google Identity Services integration
- Persistent sessions using LocalStorage
- Protected routes
- Role-based permissions for chefs and readers
- User profile and profile image management

### 📖 Recipe Management

- Create, edit, and delete recipes
- Upload recipe images
- Save recipes as drafts
- Publish recipes
- View complete recipe details
- Organize ingredients and preparation steps
- Filter recipes by category and difficulty
- Manage personal recipes from the dashboard

### 🏷️ Category Management

- Create, edit, and delete categories
- Search categories by name or description
- Role-based category administration

### 💬 Community Interaction

- Explore recipes published by other users
- View recipe authors
- Add comments to recipes
- Review recent comments from the dashboard

### ❤️ External Recipes and Favorites

- Integration with **TheMealDB**
- Search recipes by name or ingredient
- Load random recipes
- Filter results by category
- View ingredients and preparation instructions
- Save external recipes as favorites
- Manage saved favorites

### ✨ AI Recipe Generator

- Generate recipes from available ingredients
- Select meal type, difficulty, portions, and maximum preparation time
- Add dietary preferences or restrictions
- Regenerate recipe suggestions
- Convert AI-generated recipes into editable drafts
- Permission-based saving for Chef users
- Error and timeout handling

### 📊 Dashboard

- Personal recipe statistics
- Category, favorite, and comment metrics
- Recipe distribution charts
- Seven-day activity chart
- Recently created recipes
- Recent comments
- Plan usage information
- Plan management interface

### 📱 User Interface

- Responsive design for desktop, tablet, and mobile
- Reusable UI components
- Modal forms
- Loading and empty states
- Toast notifications
- Responsive sidebar and top navigation
- Custom 404 page

---

## 🛠️ Technologies Used

### Frontend

- React 19
- JavaScript
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- Tailwind CSS

### Forms and Validation

- React Hook Form
- Joi
- Hook Form Resolvers

### Interface and Visualization

- Chart.js
- React Chart.js 2
- Lucide React
- React Toastify

### Integrations

- REST API
- TheMealDB
- Google Identity Services
- Artificial Intelligence API
- JWT authentication

### Deployment

- Vercel

---

## 🔗 Related Backend Repository

This SPA consumes the REST API available in the following repository:

[API-Obl_FS_mar26](https://github.com/codewitheduardo/API-Obl_FS_mar26)

Both applications must be configured correctly for all features to work.

---

## 📋 Prerequisites

Before running the application, make sure you have installed:

- Node.js
- npm
- The CookBook REST API running locally or deployed
- A Google OAuth Client ID if Google authentication will be enabled

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/codewitheduardo/SPA-Obl_FS_mar26.git
cd SPA-Obl_FS_mar26
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:<API_PORT>/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Replace the values with the URL of your backend and your Google OAuth Client ID.

> Google authentication is optional. The application can still use traditional email and password authentication without configuring `VITE_GOOGLE_CLIENT_ID`.

### 4. Start the development server

```bash
npm run dev
```

Open the URL displayed by Vite in your browser.

---

## 📦 Available Scripts

Run the project in development mode:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

---

## 📁 Project Structure

```text
SPA-Obl_FS_mar26/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   ├── components/
│   │   ├── auth/
│   │   ├── categorias/
│   │   ├── dashboard/
│   │   ├── favoritos/
│   │   ├── ia/
│   │   ├── perfil/
│   │   ├── recetas/
│   │   └── recetasExternas/
│   ├── features/
│   ├── pages/
│   ├── store/
│   ├── utils/
│   ├── validators/
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── README.md
```

---

## 🧠 Application Architecture

The project follows a component-based frontend architecture:

- **Pages:** main application views.
- **Components:** reusable interface and domain components.
- **Features:** global state management using Redux Toolkit slices.
- **API:** centralized Axios configuration, authentication headers, and error handling.
- **Validators:** Joi validation schemas.
- **Utils:** reusable recipe, formatting, and TheMealDB functions.
- **Store:** global Redux store configuration.

Axios interceptors automatically attach the JWT token to authenticated requests.

---

## 🚧 Project Status

🟢 **Completed and functional**

The main requirements of the Full Stack academic assignment have been implemented, including authentication, authorization, CRUD operations, external API integration, AI recipe generation, responsive design, and dashboard visualization.

The project can continue to be expanded with automated testing, accessibility improvements, and additional social features.

---

## ✍️ Author

**Eduardo Monzón**  
GitHub: [codewitheduardo](https://github.com/codewitheduardo)
