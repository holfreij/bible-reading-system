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
            day={bookmarks[0]}
            totalDays={89}
          />
          <List
            listNumber={2}
            title="Pentateuch"
            booksShortNames={["GEN", "EXO", "LEV", "NUM", "DEU"]}
            day={bookmarks[1]}
            totalDays={187}
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
            day={bookmarks[2]}
            totalDays={78}
          />
          <List
            listNumber={4}
            totalDays={65}
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
            day={bookmarks[3]}
          />
          <List
            listNumber={5}
            title="Wisdom"
            booksShortNames={["JOB", "ECC", "SNG"]}
            day={bookmarks[4]}
            totalDays={62}
          />
          <List
            listNumber={6}
            title="Psalms"
            booksShortNames={["PSA"]}
            day={bookmarks[5]}
            totalDays={150}
          />
          <List
            listNumber={7}
            title="Proverbs"
            booksShortNames={["PRO"]}
            day={bookmarks[6]}
            totalDays={31}
          />
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
            day={bookmarks[7]}
            totalDays={249}
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
            day={bookmarks[8]}
            totalDays={250}
          />
          <List
            listNumber={10}
            title="Acts"
            booksShortNames={["ACT"]}
            day={bookmarks[9]}
            totalDays={28}
          />
        </>
      )}
    </>
  );
};

export default Lists;
