import List from "./List";
import { useBookmarks } from "../context/BookmarksContext";
import { useTranslationShortNames } from "../context/BibleTranslationContext";

const Lists = () => {
  const { bookmarks } = useBookmarks();
  const { shortName } = useTranslationShortNames();

  return (
    <>
      {!bookmarks || !shortName ? (
        "Please log in to load your bookmarks and set a preferred Bible Translation"
      ) : (
        <>
          <List
            listNumber={1}
            title="Gospels"
            booksShortNames={["MAT", "MRK", "LUK", "JHN"]}
          />
          <List
            listNumber={2}
            title="Pentateuch"
            booksShortNames={["GEN", "EXO", "LEV", "NUM", "DEU"]}
          />
          <List
            listNumber={3}
            title="Epistles - Part I"
            booksShortNames={[
              "ROM",
              "1CO",
              "2CO",
              "GAL",
              "EPH",
              "PHP",
              "COL",
              "HEB",
            ]}
          />
          <List
            listNumber={4}
            title="Epistles - Part II"
            booksShortNames={[
              "1TH",
              "2TH",
              "1TI",
              "2TI",
              "TIT",
              "PHM",
              "JAS",
              "1PE",
              "2PE",
              "1JN",
              "2JN",
              "3JN",
              "JUD",
              "REV",
            ]}
          />
          <List
            listNumber={5}
            title="Wisdom"
            booksShortNames={["JOB", "ECC", "SNG"]}
          />
          <List listNumber={6} title="Psalms" booksShortNames={["PSA"]} />
          <List listNumber={7} title="Proverbs" booksShortNames={["PRO"]} />
          <List
            listNumber={8}
            title="History"
            booksShortNames={[
              "JOS",
              "JDG",
              "RUT",
              "1SA",
              "2SA",
              "1KI",
              "2KI",
              "1CH",
              "2CH",
              "EZR",
              "NEH",
              "EST",
            ]}
          />
          <List
            listNumber={9}
            title="Prophets"
            booksShortNames={[
              "ISA",
              "JER",
              "LAM",
              "EZK",
              "DAN",
              "HOS",
              "JOL",
              "AMO",
              "OBA",
              "JON",
              "MIC",
              "NAM",
              "HAB",
              "ZEP",
              "HAG",
              "ZEC",
              "MAL",
            ]}
          />
          <List listNumber={10} title="Acts" booksShortNames={["ACT"]} />
        </>
      )}
    </>
  );
};

export default Lists;
