import { useProfileData } from "../context/ProfileDataProvider";
import List from "./List";

type ListInfo = {
  label: string;
  books: string[];
};

const lists: ListInfo[] = [
  { label: "Gospels", books: ["MAT", "MRK", "LUK", "JHN"] },
  { label: "Pentateuch", books: ["GEN", "EXO", "LEV", "NUM", "DEU"] },
  {
    label: "Epistles - Part I",
    books: ["ROM", "1CO", "2CO", "GAL", "EPH", "PHP", "COL", "HEB"],
  },
  {
    label: "Epistles - Part II",
    books: [
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
    ],
  },
  { label: "Wisdom", books: ["JOB", "ECC", "SNG"] },
  { label: "Psalms", books: ["PSA"] },
  { label: "Proverbs", books: ["PRO"] },
  {
    label: "History",
    books: [
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
    ],
  },
  {
    label: "Prophets",
    books: [
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
    ],
  },
  { label: "Acts", books: ["ACT"] },
];

const Lists = () => {
  const { session } = useProfileData();

  return (
    <>
      {!session ? (
        "Please log in to load your bookmarks and set a preferred Bible Translation"
      ) : (
        <>
          {lists.map((listInfo: ListInfo, index) => (
            <List
              key={listInfo.label}
              listNumber={index}
              title={listInfo.label}
              booksShortNames={listInfo.books}
            />
          ))}
        </>
      )}
    </>
  );
};

export default Lists;
