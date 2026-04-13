# Pair the Socks 🧦

A fun and educational matching game for kids! Players are shown a pile of colorful socks and must find and pair each matching sock before time runs out. Great for developing memory, pattern recognition, and color identification skills in young learners.

## 🎮 How to Play

1. A jumbled pile of socks appears on screen
2. Click or tap a sock to select it
3. Find its matching pair — same color, pattern, and size
4. Match all the pairs to win!

## 🚀 Overview

A full-stack web application with a React frontend and an Express.js backend, deployed on SiteGround shared hosting. The game is entirely client-side — all matching logic runs in the browser with no server round-trips needed for gameplay.

## ✨ Key Features

- **Fun Matching Gameplay**: Colorful socks with different patterns, colors, and sizes to match.
- **Modern Frontend**: Built with React 18, Vite, and TypeScript for a fast, responsive experience.
- **Beautiful UI Components**: Styled with Tailwind CSS and Radix UI / Shadcn primitives.
- **Type Safety**: End-to-end TypeScript across both the frontend and backend.
- **Error Resiliency**: Built-in global error boundaries and client-side error reporting.
- **Responsive Design**: Mobile-first approach with dark mode support.

## 🛠 Technology Stack

- **Framework**: [React](https://reactjs.org/) (Client) & [Express.js](https://expressjs.com/) (Server)
- **Runtime**: [Node.js](https://nodejs.org/) on [SiteGround](https://www.siteground.com/) shared hosting
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [TanStack Query](https://tanstack.com/query/latest)
- **Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Package Manager**: [Bun](https://bun.sh/)

## 💻 Getting Started

### Prerequisites

You will need [Bun](https://bun.sh/) installed on your local machine to manage dependencies and run the development environment.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pair-the-socks
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Development

Start both the Vite dev server and the Express backend concurrently:

```bash
bun run dev
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:3000/api` (proxied to Express on port 3001)

### Project Structure

- `src/`: React frontend application.
  - `components/`: UI components (including Shadcn/UI).
  - `pages/`: Application views/routes.
  - `hooks/`: Reusable React logic.
  - `lib/`: Game logic and utilities.
- `server/`: Express.js backend.
  - `index.ts`: Server entry point with middleware and static file serving.
  - `routes.ts`: API endpoint definitions.
- `public/`: Static assets copied to `dist/` at build time (includes `.htaccess`).

## ☁️ Deployment (SiteGround Shared Hosting)

This app is deployed as a **static site** on SiteGround using Apache to serve the built React files.

### Build

```bash
bun run build
```

This outputs the built frontend to `dist/`, including a `.htaccess` file for SPA routing.

### Upload via FTP/FileZilla

Upload the **contents** of `dist/` to your target folder on SiteGround, e.g.:
```
/public_html/apps/games/pair-the-socks/
```

The folder should contain:
```
.htaccess
index.html
assets/
vite.svg
```

### Configuration

- **Base path**: Set in `.env.production` via `VITE_BASE_PATH`. Update this if the deployment folder changes.
- **SPA routing**: Handled by `public/.htaccess` (Apache mod_rewrite). Update `RewriteBase` if the deployment path changes.
- **API routes**: Defined in `server/routes.ts`. Not active on static hosting — gameplay is fully client-side.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with ❤️ for kids learning through play*
