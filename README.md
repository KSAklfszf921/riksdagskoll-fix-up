# Riksdagskoll

This project fetches data from the Swedish Parliament APIs and stores it in Supabase. It is built with Vite, React, TypeScript and Tailwind CSS.

## Getting started

1. Install dependencies

```bash
npm install
```

2. Copy the environment file and add your Supabase credentials

```bash
cp .env.example .env
# then edit .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_KEY
```

3. Start the development server

```bash
npm run dev
```

## Scripts

- `npm run dev` - start Vite in development mode
- `npm run build` - build the project
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build
- `npm test` - run unit tests

## Tests

Vitest is used for unit tests. Test files live under `src/utils/__tests__`.
Run the tests with:

```bash
npm test
```


