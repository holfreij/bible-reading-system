import { BB_hashes } from "./audioHashes/BB";
import { ESV_hashes } from "./audioHashes/ESV";
import { HSV_hashes } from "./audioHashes/HSV";
import { NASB_hashes } from "./audioHashes/NASB";
import { NIV_hashes } from "./audioHashes/NIV";
import { NKJV_hashes } from "./audioHashes/NKJV";

export type BibleTranslation = {
  shortName: string;
  fullName: string;
  language: string;
  bibleNum: number;
  audioBibleNum: number;
  hashes: string[];
};

export const BibleTranslations: BibleTranslation[] = [
  {
    shortName: "ESV",
    fullName: "English Standard Version",
    language: "English",
    bibleNum: 59,
    audioBibleNum: 1,
    hashes: ESV_hashes,
  },
  {
    shortName: "NASB",
    fullName: "New American Standard Bible",
    language: "English",
    bibleNum: 2692,
    audioBibleNum: 2468,
    hashes: NASB_hashes,
  },
  {
    shortName: "NIV",
    fullName: "New International Version",
    language: "English",
    bibleNum: 111,
    audioBibleNum: 3,
    hashes: NIV_hashes,
  },
  {
    shortName: "NKJV",
    fullName: "New King James Version",
    language: "English",
    bibleNum: 114,
    audioBibleNum: 2332,
    hashes: NKJV_hashes,
  },
  {
    shortName: "HSV",
    fullName: "Herziene Statenvertaling",
    language: "Dutch",
    bibleNum: 1990,
    audioBibleNum: 621,
    hashes: HSV_hashes,
  },
  {
    shortName: "BB",
    fullName: "BasisBijbel",
    language: "Dutch",
    bibleNum: 1276,
    audioBibleNum: 1943,
    hashes: BB_hashes,
  },
];
