
# ColabCanvas

ColabCanvas is a next-generation collaborative whiteboard platform engineered for seamless, real-time teamwork. It combines advanced canvas rendering, low-latency networking, and robust backend infrastructure to deliver a Figma-like experience for brainstorming, diagramming, and ideation.

---

## 🚀 Key Features

- **Real-Time Multiplayer Canvas**: Built on top of WebSockets for instant, bi-directional updates. All drawing, text, and object changes are synchronized across users in a room with sub-100ms latency.
- **CRDT-Based State Management**: Uses Conflict-free Replicated Data Types (CRDTs) to ensure eventual consistency and seamless merging of concurrent edits, even under network partitions.
- **Rich Drawing Tools**: Freehand, shapes, text, eraser, zoom, pan, and multi-user cursors. All tools are modular and extensible.
- **User Presence & Awareness**: See who is online, their cursor positions, and what they are editing in real time.
- **Authentication & Room Management**: Secure sign-up/sign-in, room creation/joining, and persistent user sessions.
- **Optimistic UI & Undo/Redo**: Instant feedback for user actions, with robust undo/redo powered by CRDT history.
- **Scalable Microservices Architecture**: Decoupled HTTP and WebSocket backends, each optimized for their domain (REST APIs, real-time sync, file uploads, etc).
- **Cloud-Native & Local-First**: Designed for both cloud deployment and local development, with Dockerized Postgres and stateless services.
- **Type-Safe End-to-End**: Shared TypeScript types across frontend, backend, and database for zero type drift.
- **Customizable UI Library**: Built with a reusable, themeable component system using Tailwind CSS and React.

---

## 🏗️ Architecture Overview

```mermaid
graph TD
	A[Frontend (Next.js)] -- REST/WS --> B[HTTP Backend (Express)]
	A -- WebSocket --> C[WS Backend (Node.js)]
	B -- Prisma ORM --> D[(PostgreSQL)]
	C -- CRDT Sync --> D
	A -- Shared Types --> B
	A -- Shared Types --> C
	B -- Shared Types --> C
```

- **Frontend**: Next.js app with advanced canvas rendering, state managed by CRDTs, and real-time updates via WebSocket.
- **HTTP Backend**: Node.js/Express API for authentication, room management, and file uploads. Uses Prisma for DB access.
- **WebSocket Backend**: Dedicated Node.js server for real-time canvas sync, presence, and CRDT operations.
- **Database**: PostgreSQL, managed with Prisma, stores users, rooms, and persistent canvas data.
- **Shared Packages**: TypeScript types, UI components, and utilities shared across all services.

---

## 🧑‍💻 Deep Tech Stack

- **Frontend**: Next.js, React 18, TypeScript, Tailwind CSS, Zustand (or similar) for state, custom CRDT implementation
- **Real-Time**: Native WebSocket server, custom protocol for efficient binary diff sync, presence, and awareness
- **Backend**: Node.js, Express, Prisma ORM, JWT authentication, REST APIs, file uploads
- **Database**: PostgreSQL (Dockerized for local dev), Prisma migrations, connection pooling
- **Monorepo**: pnpm workspaces, TurboRepo for build orchestration, strict type sharing
- **Testing**: Jest, React Testing Library, supertest for API, integration tests for CRDT logic
- **DevOps**: Docker, GitHub Actions CI, Vercel/Render/Heroku deploy ready

---

## 📦 Monorepo Structure

```
ColabCanvas/
├── apps/
│   ├── Frontend/         # Next.js app (canvas, auth, UI)
│   ├── http-backend/     # Express API (auth, rooms, uploads)
│   └── ws-backend/       # WebSocket server (real-time sync)
├── packages/
│   ├── @types/           # Shared TypeScript types
│   ├── common/           # Shared utilities (CRDT, helpers)
│   ├── db/               # Prisma schema, migrations, client
│   ├── eslint-config/    # Shared ESLint config
│   ├── typescript-config/# Shared TS config
│   └── ui/               # Shared React UI components
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (v8+)
- Docker (for local Postgres)

### 1. Install dependencies
```bash
pnpm install
```

### 2. Set up environment variables
- Copy `.env.example` to `.env` and fill in DB, JWT, and other secrets.

### 3. Start Postgres (local)
```bash
docker run --name colabcanvas-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15
```

### 4. Run DB migrations
```bash
cd packages/db
pnpm prisma migrate dev
```

### 5. Start all apps
```bash
pnpm run dev
```

---

## 🛠️ Development & Customization

- **Canvas Logic**: See `apps/Frontend/draw/` for custom drawing, shape rendering, and CRDT logic.
- **Authentication**: JWT-based, with session management in `apps/http-backend`.
- **Real-Time Sync**: WebSocket protocol and CRDT merge in `apps/ws-backend`.
- **UI Components**: Modular, themeable React components in `packages/ui`.
- **Type Safety**: All API contracts and DB models are type-checked end-to-end.

---

## 🧩 Extending ColabCanvas

- Add new tools or shapes by extending the canvas logic and UI.
- Integrate with cloud storage for persistent uploads.
- Deploy to Vercel, Render, or your own infra (Docker-ready).

---

## 🤝 Contributing
We welcome contributions! Please open issues, submit PRs, and help us build the best collaborative canvas platform.

---

## 📄 License
[MIT](LICENSE)

---

## 🙏 Acknowledgements
- [Yjs](https://yjs.dev/) / [Automerge](https://automerge.org/) inspiration for CRDTs
- [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), [TurboRepo](https://turbo.build/), [Tailwind CSS](https://tailwindcss.com/)

---

## 📬 Contact
For questions, support, or demo requests, please open an issue or contact the maintainer.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
# ColabCanvas
