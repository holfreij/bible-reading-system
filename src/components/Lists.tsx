import { useEffect, useState } from "react";
import { useProfileData } from "../context/ProfileDataProvider";
import List from "./List";
import AudioControls from "./AudioControls";
import {
  AudioProvider,
  AudioObject,
  useAudioContext,
} from "../context/AudioObjectDataProvider";
import {
  getTodaysReading,
  getGlobalChapterNumber,
} from "../utils/scripture-utils";
import { loadTranslationHashes } from "../utils/bible-translation";

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

const usePrePopulateQueue = () => {
  const { bookmarks, translation } = useProfileData();
  const { addAudioObjects } = useAudioContext();

  useEffect(() => {
    if (!bookmarks || !translation) return;

    let ignore = false;

    loadTranslationHashes(translation.shortName).then((hashes) => {
      if (ignore) return;

      const audioObjects: AudioObject[] = [];
      lists.forEach((listInfo, listNumber) => {
        const reading = getTodaysReading(bookmarks[listNumber], listInfo.books);
        if (!reading) return;

        const globalChapterNumber = getGlobalChapterNumber(reading);
        const audioHash = globalChapterNumber
          ? hashes[globalChapterNumber - 1]
          : undefined;

        const url = audioHash
          ? `https://audio-bible-cdn.youversionapi.com/${translation.audioBibleNum}/32k/${reading.shortName}/${reading.chapter}-${audioHash}.mp3?version_id=${translation.bibleNum}`
          : `https://www.bible.com/audio-bible/${translation.bibleNum}/${reading.shortName}.${reading.chapter}.${translation.shortName}`;

        audioObjects.push({
          url,
          list: listNumber,
          day: bookmarks[listNumber],
          book: reading.fullName,
          chapter: reading.chapter,
        });
      });

      addAudioObjects(audioObjects);
    });

    return () => {
      ignore = true;
    };
  }, [bookmarks, translation, addAudioObjects]);
};

const ListsContent = () => {
  const { user, loading, fetchError } = useProfileData();
  const [openList, setOpenList] = useState<number>(-1);

  usePrePopulateQueue();

  const openListChangeHandler = (newValue: number) => {
    setOpenList(newValue % 10);
  };

  return !user ? (
    "Please log in to load your bookmarks and set a preferred Bible Translation"
  ) : (
    <>
      {fetchError && (
        <div className="alert alert-error">
          <span>Failed to load profile: {fetchError}</span>
        </div>
      )}
      <div className="flex flex-col gap-2 pb-[286px]">
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
      <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4 z-50">
        <AudioControls />
      </div>
    </>
  );
};

const Lists = () => (
  <AudioProvider>
    <ListsContent />
  </AudioProvider>
);

export default Lists;
