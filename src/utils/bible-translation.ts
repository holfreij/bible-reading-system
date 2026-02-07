export type BibleTranslation = {
  shortName: string;
  fullName: string;
  language: string;
  bibleNum: number;
  audioBibleNum: number;
  hashes: string[];
};

type BibleTranslationConfig = Omit<BibleTranslation, "hashes"> & {
  loadHashes: () => Promise<string[]>;
};

const translationConfigs: BibleTranslationConfig[] = [
  {
    shortName: "ESV",
    fullName: "English Standard Version",
    language: "English",
    bibleNum: 59,
    audioBibleNum: 1,
    loadHashes: () => import("./audioHashes/ESV").then((m) => m.ESV_hashes),
  },
  {
    shortName: "NASB",
    fullName: "New American Standard Bible",
    language: "English",
    bibleNum: 2692,
    audioBibleNum: 2468,
    loadHashes: () => import("./audioHashes/NASB").then((m) => m.NASB_hashes),
  },
  {
    shortName: "NIV",
    fullName: "New International Version",
    language: "English",
    bibleNum: 111,
    audioBibleNum: 3,
    loadHashes: () => import("./audioHashes/NIV").then((m) => m.NIV_hashes),
  },
  {
    shortName: "NKJV",
    fullName: "New King James Version",
    language: "English",
    bibleNum: 114,
    audioBibleNum: 2332,
    loadHashes: () => import("./audioHashes/NKJV").then((m) => m.NKJV_hashes),
  },
  {
    shortName: "HSV",
    fullName: "Herziene Statenvertaling",
    language: "Dutch",
    bibleNum: 1990,
    audioBibleNum: 621,
    loadHashes: () => import("./audioHashes/HSV").then((m) => m.HSV_hashes),
  },
  {
    shortName: "BB",
    fullName: "BasisBijbel",
    language: "Dutch",
    bibleNum: 1276,
    audioBibleNum: 1943,
    loadHashes: () => import("./audioHashes/BB").then((m) => m.BB_hashes),
  },
];

const hashCache = new Map<string, string[]>();

export async function loadTranslationHashes(
  shortName: string
): Promise<string[]> {
  const cached = hashCache.get(shortName);
  if (cached) return cached;

  const config = translationConfigs.find((t) => t.shortName === shortName);
  if (!config) return [];

  const hashes = await config.loadHashes();
  hashCache.set(shortName, hashes);
  return hashes;
}

// BibleTranslations without hashes for UI display (dropdowns, etc.)
export const BibleTranslations: Omit<BibleTranslation, "hashes">[] =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  translationConfigs.map(({ loadHashes, ...rest }) => rest);
