export interface BookInfo {
  shortName: string;
  fullName: string;
  chapters: number;
}

export type BookChapter = {
  shortName: string;
  fullName: string;
  chapter: number;
};

export const scrBookData: BookInfo[] = [
  { shortName: "GEN", fullName: "Genesis", chapters: 50 },
  { shortName: "EXO", fullName: "Exodus", chapters: 40 },
  { shortName: "LEV", fullName: "Leviticus", chapters: 27 },
  { shortName: "NUM", fullName: "Numbers", chapters: 36 },
  { shortName: "DEU", fullName: "Deuteronomy", chapters: 34 },
  { shortName: "JOS", fullName: "Joshua", chapters: 24 },
  { shortName: "JDG", fullName: "Judges", chapters: 21 },
  { shortName: "RUT", fullName: "Ruth", chapters: 4 },
  { shortName: "1SA", fullName: "1 Samuel", chapters: 31 },
  { shortName: "2SA", fullName: "2 Samuel", chapters: 24 },
  { shortName: "1KI", fullName: "1 Kings", chapters: 22 },
  { shortName: "2KI", fullName: "2 Kings", chapters: 25 },
  { shortName: "1CH", fullName: "1 Chronicles", chapters: 29 },
  { shortName: "2CH", fullName: "2 Chronicles", chapters: 36 },
  { shortName: "EZR", fullName: "Ezra", chapters: 10 },
  { shortName: "NEH", fullName: "Nehemiah", chapters: 13 },
  { shortName: "EST", fullName: "Esther", chapters: 10 },
  { shortName: "JOB", fullName: "Job", chapters: 42 },
  { shortName: "PSA", fullName: "Psalms", chapters: 150 },
  { shortName: "PRO", fullName: "Proverbs", chapters: 31 },
  { shortName: "ECC", fullName: "Ecclesiastes", chapters: 12 },
  { shortName: "SNG", fullName: "Song of Solomon", chapters: 8 },
  { shortName: "ISA", fullName: "Isaiah", chapters: 66 },
  { shortName: "JER", fullName: "Jeremiah", chapters: 52 },
  { shortName: "LAM", fullName: "Lamentations", chapters: 5 },
  { shortName: "EZK", fullName: "Ezekiel", chapters: 48 },
  { shortName: "DAN", fullName: "Daniel", chapters: 12 },
  { shortName: "HOS", fullName: "Hosea", chapters: 14 },
  { shortName: "JOL", fullName: "Joel", chapters: 3 },
  { shortName: "AMO", fullName: "Amos", chapters: 9 },
  { shortName: "OBA", fullName: "Obadiah", chapters: 1 },
  { shortName: "JON", fullName: "Jonah", chapters: 4 },
  { shortName: "MIC", fullName: "Micah", chapters: 7 },
  { shortName: "NAM", fullName: "Nahum", chapters: 3 },
  { shortName: "HAB", fullName: "Habakkuk", chapters: 3 },
  { shortName: "ZEP", fullName: "Zephaniah", chapters: 3 },
  { shortName: "HAG", fullName: "Haggai", chapters: 2 },
  { shortName: "ZEC", fullName: "Zechariah", chapters: 14 },
  { shortName: "MAL", fullName: "Malachi", chapters: 4 },
  { shortName: "MAT", fullName: "Matthew", chapters: 28 },
  { shortName: "MRK", fullName: "Mark", chapters: 16 },
  { shortName: "LUK", fullName: "Luke", chapters: 24 },
  { shortName: "JHN", fullName: "John", chapters: 21 },
  { shortName: "ACT", fullName: "Acts", chapters: 28 },
  { shortName: "ROM", fullName: "Romans", chapters: 16 },
  { shortName: "1CO", fullName: "1 Corinthians", chapters: 16 },
  { shortName: "2CO", fullName: "2 Corinthians", chapters: 13 },
  { shortName: "GAL", fullName: "Galatians", chapters: 6 },
  { shortName: "EPH", fullName: "Ephesians", chapters: 6 },
  { shortName: "PHP", fullName: "Philippians", chapters: 4 },
  { shortName: "COL", fullName: "Colossians", chapters: 4 },
  { shortName: "1TH", fullName: "1 Thessalonians", chapters: 5 },
  { shortName: "2TH", fullName: "2 Thessalonians", chapters: 3 },
  { shortName: "1TI", fullName: "1 Timothy", chapters: 6 },
  { shortName: "2TI", fullName: "2 Timothy", chapters: 4 },
  { shortName: "TIT", fullName: "Titus", chapters: 3 },
  { shortName: "PHM", fullName: "Philemon", chapters: 1 },
  { shortName: "HEB", fullName: "Hebrews", chapters: 13 },
  { shortName: "JAS", fullName: "James", chapters: 5 },
  { shortName: "1PE", fullName: "1 Peter", chapters: 5 },
  { shortName: "2PE", fullName: "2 Peter", chapters: 3 },
  { shortName: "1JN", fullName: "1 John", chapters: 5 },
  { shortName: "2JN", fullName: "2 John", chapters: 1 },
  { shortName: "3JN", fullName: "3 John", chapters: 1 },
  { shortName: "JUD", fullName: "Jude", chapters: 1 },
  { shortName: "REV", fullName: "Revelation", chapters: 22 },
];

export const getBookInfo = (shortName: string): BookInfo => {
  const bookData = scrBookData.find(
    (book: BookInfo) => book.shortName === shortName
  );
  if (!bookData)
    throw new Error(`Unknown book! The shortName '${shortName}' is not valid.`);
  return bookData;
};

export const getTodaysReading = (
  day: number,
  shortNames: string[]
): BookChapter => {
  let chapterSum = 0;

  const totalChapters = shortNames.reduce((sum, shortName) => {
    const bookData = getBookInfo(shortName);
    return sum + bookData.chapters;
  }, 0);

  const wrappedDay = ((day - 1) % totalChapters) + 1;

  for (const shortName of shortNames) {
    const bookData = getBookInfo(shortName);

    const newChapterSum = chapterSum + bookData.chapters;

    if (wrappedDay <= newChapterSum) {
      const chapter = wrappedDay - chapterSum;
      return {
        shortName: bookData.shortName,
        fullName: bookData.fullName,
        chapter,
      };
    }

    chapterSum = newChapterSum;
  }

  throw new Error("Day is out of range.");
};

export function getGlobalChapterNumber(
  bookChapter: BookChapter
): number | undefined {
  let cumulativeChapter = 0;

  for (const book of scrBookData) {
    if (book.shortName === bookChapter.shortName) {
      if (bookChapter.chapter >= 1 && bookChapter.chapter <= book.chapters) {
        return cumulativeChapter + bookChapter.chapter;
      }
      return undefined;
    }
    cumulativeChapter += book.chapters;
  }

  return undefined;
}
