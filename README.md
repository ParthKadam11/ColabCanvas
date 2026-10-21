
<div align="center">

# ColabCanvas

<img src="./apps/Frontend/public/ColabCanvas.gif" alt="ColabCanvas Demo" width="600"/>

</div>

ColabCanvas is a shared whiteboard. People in the same room see each finished shape, freehand stroke, text item, or erase. The board is rebuilt by replaying stored events.

---

## Key features

- **Shared canvas**: A finished stroke is sent over a WebSocket to other people in the room. Mouse movement while drawing stays in the browser.
- **Stroke event log**: Each finished shape or erase is stored as its own record. Opening a room replays the latest 50 events. Concurrent edits are applied in arrival order. There is no CRDT merge.
- **Drawing tools**: Rectangle, circle, line, freehand, text, eraser, and zoom.
- **Who is connected**: The WebSocket server keeps an in-memory list of connected users. The client polls that list. There are no live cursors.
- **Accounts and rooms**: Sign-up and sign-in return a JWT that the browser stores in localStorage. You can create a room, join by room name, and list rooms you created.
- **Two backends**: An Express API handles accounts, rooms, and profile photos. A separate process broadcasts strokes and then writes them to PostgreSQL. Connected users live in memory on that one process.
- **Where it runs**: Local Postgres can run in Docker. The frontend and the two backends can be deployed separately.
- **Validation**: Signup, sign-in, and room requests are checked with Zod. WebSocket drawing messages are plain JSON and are not schema-checked.
- **Shared UI**: Small React components in `packages/ui`, styled with Tailwind CSS.

---

- **Frontend**: Next.js app with a custom canvas engine. Drawing state is an in-memory shape list, updated over WebSocket and rebuilt by replaying stored events.
- **HTTP Backend**: Node.js/Express API for authentication, room management, and file uploads. Uses Prisma for DB access.
- **WebSocket Backend**: Dedicated Node.js server that broadcasts finished drawing events, then saves them to PostgreSQL. Presence is an in-memory list of connected users.
- **Database**: PostgreSQL, managed with Prisma, stores users, rooms, and drawing events. Opening a room loads the latest 50 events.
- **Shared Packages**: TypeScript types, UI components, and utilities shared across all services.

---

## 🧑‍💻 Deep Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, custom HTML5 Canvas drawing engine
- **Real-Time**: Native WebSocket server
- **Backend**: Node.js, Express, Prisma ORM, JWT authentication, REST APIs, file uploads
- **Database**: PostgreSQL (Dockerized for local dev), Prisma migrations, connection pooling
- **Monorepo**: pnpm workspaces and Turborepo for build orchestration
- **DevOps**: Docker for local Postgres. CORS allows a separately hosted frontend.

---

## 📦 Monorepo Structure

```
ColabCanvas/
├── apps/
│   ├── Frontend/         # Next.js app (canvas, auth, UI)
│   ├── http-backend/     # Express API (auth, rooms, uploads)
│   └── ws-backend/       # WebSocket stroke broadcast and presence
├── packages/
│   ├── @types/           # Shared TypeScript types
│   ├── common/           # Shared Zod validation schemas
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
- Node.js 20.19 or newer
- pnpm 9
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

- **Canvas Logic**: See `apps/Frontend/draw/` for drawing, shape rendering, and replaying stored stroke events.
- **Authentication**: JWT checks in `apps/http-backend`. The token is stored in the browser, not in an httpOnly cookie.
- **Real-Time Sync**: WebSocket broadcast of finished strokes in `apps/ws-backend`, followed by a database write.
- **UI Components**: Shared React components in `packages/ui`.
- **Type Safety**: Prisma models and Zod schemas cover accounts and rooms. WebSocket drawing messages are untyped JSON strings.

---

## 🧩 Extending ColabCanvas

- Add new tools or shapes by extending the canvas logic and UI.
- Integrate with cloud storage for persistent uploads.
- Deploy to Vercel, Render, or your own infra (Docker-ready).

---

## 🤝 Contributing
Open an issue or a pull request if you want to change the project.

---

## License
This repository does not include a LICENSE file.

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
> Vercel Remote Cache is free for all plans.	

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

