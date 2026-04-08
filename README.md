# Pair the Socks

[cloudflarebutton]

A high-performance web application built on Cloudflare's modern developer stack. This project leverages Cloudflare Workers for its backend logic and Vite-powered React for the frontend, ensuring a seamless, global-scale experience with minimal latency.

## 🚀 Overview

This application is designed to demonstrate a robust full-stack architecture using Cloudflare's ecosystem. It provides a type-safe environment from the edge to the browser, utilizing Hono for routing and React with Tailwind CSS for a sophisticated UI.

## ✨ Key Features

- **Edge-First Backend**: Powered by Cloudflare Workers and Hono for ultra-fast API responses.
- **Modern Frontend**: Built with React 18, Vite, and TypeScript for a premier developer experience.
- **Beautiful UI Components**: Styled with Tailwind CSS and pre-configured with Radix UI / Shadcn primitives.
- **Workflow & Persistence**: Architecture ready for Cloudflare Workflows, KV, and Durable Objects.
- **Type Safety**: End-to-end TypeScript integration across both the worker and the client.
- **Error Resiliency**: Built-in global error boundaries and client-side error reporting to the worker.
- **Responsive Design**: Mobile-first approach with a built-in sidebar system and dark mode support.

## 🛠 Technology Stack

- **Framework**: [React](https://reactjs.org/) (Client) & [Hono](https://hono.dev/) (Worker)
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/)
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

Start the development server (both Vite and the Worker simulator):

```bash
bun run dev
```

The frontend will be available at `http://localhost:3000` and the API at `http://localhost:3000/api`.

### Project Structure

- `src/`: React frontend application.
  - `components/`: UI components (including Shadcn/UI).
  - `pages/`: Application views/routes.
  - `hooks/`: Reusable React logic.
- `worker/`: Cloudflare Worker backend.
  - `index.ts`: Entry point and middleware.
  - `userRoutes.ts`: Define your API endpoints here.
- `shared/`: TypeScript types and logic shared between frontend and backend.

## ☁️ Deployment

Deploying to Cloudflare is streamlined via Wrangler.

[cloudflarebutton]

### Manual Deployment

1. Build the frontend and deploy the worker:
   ```bash
   bun run deploy
   ```

2. Follow the prompts to authenticate with your Cloudflare account if you haven't already.

### Configuration

Environment bindings and project settings are managed in `wrangler.jsonc`. Ensure your `compatibility_date` is kept up to date for the latest Cloudflare features.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with ❤️ on the Cloudflare Developer Platform*