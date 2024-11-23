export type BibleTranslation = {
  shortName: string;
  fullName: string;
  language: string;
  bibleNum: number;
};

export const BibleTranslations: BibleTranslation[] = [
  {
    shortName: "ESV",
    fullName: "English Standard Version",
    language: "English",
    bibleNum: 59,
  },
  {
    shortName: "NASB",
    fullName: "New American Standard Bible",
    language: "English",
    bibleNum: 2692,
  },
  {
    shortName: "NIV",
    fullName: "New International Version",
    language: "English",
    bibleNum: 111,
  },
  {
    shortName: "NKJV",
    fullName: "New King James Version",
    language: "English",
    bibleNum: 114,
  },
  {
    shortName: "HSV",
    fullName: "Herziene Statenvertaling",
    language: "Dutch",
    bibleNum: 1990,
  },
  {
    shortName: "BB",
    fullName: "BasisBijbel",
    language: "Dutch",
    bibleNum: 1276,
  },
];
