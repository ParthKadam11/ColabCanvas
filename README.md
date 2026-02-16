# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.
# ColabCanvas

ColabCanvas is a collaborative whiteboard application that allows multiple users to draw, write, and interact in real-time. The project is organized as a monorepo using pnpm workspaces and TurboRepo, and is built with a modern stack including Next.js, TypeScript, Tailwind CSS, Prisma, and both HTTP and WebSocket backends.

---

## Table of Contents
- [Features](#features)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Tech Stack](#tech-stack)
- [Database & Migrations](#database--migrations)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- Real-time collaborative drawing and text
- User authentication (sign in/up)
- Room creation and joining
- Zoom, pan, and eraser tools
- User presence indicators
- Responsive UI with modern design

---

## Monorepo Structure

```
ColabCanvas/
├── apps/
│   ├── Frontend/         # Next.js frontend app
│   ├── http-backend/     # HTTP backend (API)
│   └── ws-backend/       # WebSocket backend
├── packages/
│   ├── @types/           # Shared TypeScript types
│   ├── common/           # Common utilities
│   ├── db/               # Prisma schema & database client
│   ├── eslint-config/    # Shared ESLint config
│   └── typescript-config/# Shared TS config
│   └── ui/               # Shared UI components
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (v8+)
- Docker (for local Postgres, optional but recommended)

### Install dependencies
```bash
pnpm install
```

### Set up environment variables
- Copy `.env.example` to `.env` and fill in required values for database, authentication, etc.

### Database setup
- Start Postgres (locally or via Docker)
- Run migrations:
```bash
cd packages/db
pnpm prisma migrate dev
```

### Run the apps
- Start all apps in development mode:
```bash
pnpm run dev
```

---

## Development
- **Frontend**: Next.js app in `apps/Frontend`
- **HTTP Backend**: Express/Node.js API in `apps/http-backend`
- **WebSocket Backend**: Real-time server in `apps/ws-backend`
- **Database**: Prisma schema and client in `packages/db`
- **UI Library**: Shared React components in `packages/ui`

Use TurboRepo for running and building multiple apps/packages efficiently.

---

## Tech Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, WebSocket
- **Database**: PostgreSQL, Prisma ORM
- **Monorepo**: pnpm, TurboRepo
- **Linting/Formatting**: ESLint, Prettier

---

## Database & Migrations
- Prisma schema is in `packages/db/prisma/schema.prisma`
- Migrations are managed with Prisma CLI
- Generated client is in `packages/db/src/generated/prisma/`

---

## Contributing
1. Fork the repo and create your branch from `main`.
2. Install dependencies with `pnpm install`.
3. Make your changes and add tests if applicable.
4. Run lint and tests before submitting a PR.
5. Submit a pull request.

---

## License
[MIT](LICENSE)

---

## Acknowledgements
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [TurboRepo](https://turbo.build/)
- [pnpm](https://pnpm.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Contact
For questions or support, please open an issue or contact the maintainer.

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
