import { useState } from "react";
import { useProfileData } from "../context/ProfileDataProvider";
import List from "./List";
import AudioControls from "./AudioControls";
import { AudioProvider } from "../context/AudioObjectDataProvider";

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
  const { user, loading } = useProfileData();
  const [openList, setOpenList] = useState<number>(-1);

  const openListChangeHandler = (newValue: number) => {
    setOpenList(newValue % 10);
  };

  return (
    <AudioProvider>
      {!user ? (
        "Please log in to load your bookmarks and set a preferred Bible Translation"
      ) : (
        <>
          <div className="flex flex-col gap-2 pb-[276px]">
            {!loading &&
              lists.map((listInfo: ListInfo, index) => (
                <List
                  key={listInfo.label}
                  listNumber={index}
                  title={listInfo.label}
                  booksShortNames={listInfo.books}
                  openList={openList}
                  onChangeOpenList={openListChangeHandler}
                />
              ))}
          </div>
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-auto shadow-lg z-50">
            <AudioControls />
          </div>
        </>
      )}
    </AudioProvider>
  );
};

export default Lists;
