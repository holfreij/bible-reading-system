# Bible Reading System

A web app for tracking daily Bible reading progress using [Professor Grant Horner's Bible-Reading System](https://sohmer.net/media/professor_grant_horners_bible_reading_system.pdf). Read one chapter from each of 10 lists every day, with bookmarks that sync across devices.

**Live:** [holfreij.github.io/bible-reading-system](https://holfreij.github.io/bible-reading-system)

## Features

- **10-list reading tracker** - Gospels, Pentateuch, Epistles I & II, Wisdom, Psalms, Proverbs, History, Prophets, and Acts
- **Audio playback** - Listen to chapters directly from YouVersion's audio CDN with queue management and browser media controls
- **Cloud sync** - Bookmarks and translation preferences stored in Supabase, synced across devices
- **Multiple translations** - ESV, NASB, NIV, NKJV, HSV (Dutch), BasisBijbel (Dutch)
- **Passwordless login** - Sign in with a magic link via email

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** TailwindCSS + DaisyUI
- **Backend:** Supabase (auth + PostgreSQL)
- **Testing:** Vitest
- **Deployment:** GitHub Pages (auto-deploys on push to `main`)

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project with a `profiles` table containing columns: `id`, `username`, `bookmarks`, `translation`, `updated_at`

### Setup

```bash
git clone https://github.com/holfreij/bible-reading-system.git
cd bible-reading-system
npm install
cp .env.example .env  # Fill in your Supabase credentials
npm run dev
```

### Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Start dev server                    |
| `npm run build`  | Type-check and build for production |
| `npm run test`   | Run tests in watch mode             |
| `npm run lint`   | Run ESLint                          |
| `npm run format` | Format code with Prettier           |

## How It Works

The system divides the Bible into 10 overlapping reading lists of varying lengths. Each day you read one chapter from each list. Because the lists have different lengths (e.g., Psalms has 150 chapters while Proverbs has 31), they cycle at different rates, creating unique combinations of readings over time.

Bookmarks are stored as an array of day numbers (one per list). When you press "Done" on a reading, that list's bookmark advances by one. The day number wraps around automatically when you complete a list.

## Audio System

Audio is streamed from YouVersion's CDN. Each chapter requires a unique hash to construct the audio URL. These hashes are stored per-translation in `src/utils/audioHashes/` and are lazy-loaded to keep the initial bundle small.

The extraction script (`src/utils/audioHashes/extract-audio-hashes.ts`) is a standalone Puppeteer script that scrapes these hashes from bible.com. It is not part of the application build.

## Deployment

Pushes to `main` trigger automatic deployment to GitHub Pages via GitHub Actions. The workflow requires two repository secrets:

- `VITE_SUPABASE_PROJECT_URL`
- `VITE_SUPABASE_ANON_KEY`

## License

All scripture text and audio is used with the courtesy of [Bible.com](https://www.bible.com/) by [YouVersion](https://www.youversion.com/).
