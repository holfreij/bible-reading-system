# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite production build
npm run test         # Run Vitest in watch mode
npx vitest run       # Run tests once (CI mode)
npx vitest run src/utils/__tests__/scripture-utils.test.ts  # Single test file
npm run lint         # ESLint (has a pre-existing typescript-eslint version conflict; use tsc -b as the reliable check)
npm run format       # Prettier on all src files
npx tsc -b           # TypeScript type-check only (strict, no unused locals/params)
```

Husky pre-commit hook runs `lint-staged` (ESLint + Prettier on staged `.ts`/`.tsx` files).

## Architecture

React 18 + TypeScript + Vite app for tracking Bible reading progress using Professor Grant Horner's 10-list system. Supabase handles auth (OTP magic links) and profile persistence.

### Context Providers & Data Flow

```
App (ErrorBoundary wraps everything)
└─ ProfileDataProvider          ← user session, bookmarks[], translation
   ├─ Header → UserControl      ← login button, modal with Auth/Account
   └─ Lists
      └─ AudioProvider          ← audio queue (nested inside Lists, not App)
         ├─ List[] (×10)        ← each list reads bookmarks[listNumber]
         └─ AudioControls       ← plays queue, advances bookmarks on finish
```

- **ProfileDataProvider** (`src/context/ProfileDataProvider.tsx`): Manages Supabase auth state, fetches/syncs profile. Bookmark and translation changes are debounced (500ms) before upserting. A `hasFetched` ref prevents the sync effect from firing on initial load.
- **AudioProvider** (`src/context/AudioObjectDataProvider.tsx`): Manages a sorted audio queue. Items added explicitly via "Listen" button, not on mount. Queue sorted by `(day, list)`.

### Audio Hash System

Audio is served from YouVersion's CDN. Each chapter's audio URL requires a hash unique to that translation+chapter. These hashes are stored in `src/utils/audioHashes/{TRANSLATION}.ts` (~1189 entries each).

- Hashes are **lazy-loaded** via dynamic `import()` in `bible-translation.ts` and cached in a `Map`
- `loadTranslationHashes(shortName)` returns a `Promise<string[]>` indexed by global chapter number (1-based, subtract 1 for array access)
- `BibleTranslations` export is `Omit<BibleTranslation, "hashes">[]` — no hashes in the initial bundle
- The extraction script (`src/utils/audioHashes/extract-audio-hashes.ts`) uses Puppeteer to scrape hashes from bible.com — it's standalone, not part of the app

### Scripture Utilities (`src/utils/scripture-utils.ts`)

- `scrBookData`: All 66 books with shortName, fullName, chapter count
- `getTodaysReading(day, shortNames)`: Wraps day number to a specific book+chapter using `((day - 1) % totalChapters) + 1`
- `getGlobalChapterNumber(bookChapter)`: Maps a book+chapter to sequential number 1–1189 (used for hash array indexing)

### Key Types

- `TranslationInfo` = `Omit<BibleTranslation, "hashes">` — used throughout the app (no hashes needed except in List.tsx for audio URL construction)
- `AudioObject` = `{ url, list, day, book, chapter }` — items in the audio queue
- Bookmarks are `number[]` indexed by list number (0–9), each value is day number (1-based)

## Environment Variables

Required in `.env` (see `.env.example`):

- `VITE_SUPABASE_PROJECT_URL`
- `VITE_SUPABASE_ANON_KEY`

GitHub Pages deployment reads these from repository secrets.

## Gotchas

- ESLint has a version conflict between `typescript-eslint` and `eslint`. Use `tsc -b` for reliable type checking.
- `react-audio-player` is a legacy class component package. Code accesses `audioPlayerRef.current?.audioEl.current` to reach the underlying `<audio>` element.
- The `AudioProvider` is nested inside `Lists`, not at the App level.
- The base path is `/bible-reading-system/` (configured in `vite.config.ts`) for GitHub Pages deployment.
