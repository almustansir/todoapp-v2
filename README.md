This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```plaintext
Folder Structure:

todoapp-v2/
├── src/
│   ├── app/                # App Router (Pages, Layouts, API routes)
│   │   ├── (auth)/         # Route group for login/signup
│   │   ├── dashboard/      # Protected task area
│   │   └── layout.tsx      # Root layout (Providers go here)
│   ├── components/
│   │   ├── ui/             # Atomic components (Buttons, Inputs - shadcn/ui style)
│   │   ├── layout/         # Navbar, Sidebar, Footer
│   │   └── todo/           # Feature-specific components (TodoList, TodoItem)
│   ├── lib/
│   │   ├── firebase/       # Firebase config and initialization
│   │   └── utils.ts        # Shared helper functions (e.g., clsx, tailwind-merge)
│   ├── hooks/              # Custom React hooks (useAuth, useTodos)
│   ├── services/           # Firebase CRUD logic (getTodos, addTask)
│   ├── store/              # State management (Zustand or React Context)
│   └── types/              # TypeScript interfaces/types
├── public/                 # Static assets
└── .env.local              # Firebase API Keys
```
