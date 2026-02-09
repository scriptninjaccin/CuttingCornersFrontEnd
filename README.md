# CuttingCorners Frontend

A modern React frontend powered by **Vite** for fast development, instant HMR, and optimized production builds.

---

## 🚀 Tech Stack

* **React**
* **Vite** (build tool & dev server)
* **ESLint** (code quality)
* **Node.js** (v18+ recommended)

---

## 📦 Getting Started

### Prerequisites

* Node.js 18 or newer
* npm (comes with Node)

### Installation

```bash
npm install
```

### Development

Start the local dev server with hot module replacement (HMR):

```bash
npm run dev
```

Open your browser at the URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173)).

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

> Note: Use `npm run build` (or `npx vite build`) instead of calling `vite` directly unless Vite is installed globally.

---

## 📁 Project Structure

```
CuttingCornersFrontEnd/
├── public/          # Static assets
├── src/             # Application source code
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🏗️ Production Build

Create an optimized production build:

```bash
npm run build
```

The output will be generated in the `dist/` directory.

Preview the build locally:

```bash
npm run preview
```

---

## 🔌 Vite Plugins

This project uses one of the official React plugins:

* `@vitejs/plugin-react` – Babel-based Fast Refresh
* `@vitejs/plugin-react-swc` – SWC-based Fast Refresh (faster builds)

---

## 🧹 Linting

Run ESLint to check code quality:

```bash
npm run lint
```

For production-scale apps, consider migrating to **TypeScript** with type-aware linting using [`typescript-eslint`](https://typescript-eslint.io).

---

## 📄 License

This project is licensed under the MIT License.

---

Happy coding ✨
