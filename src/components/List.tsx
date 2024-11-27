import { Dispatch, SetStateAction, useMemo } from "react";
import {
  BookChapter,
  getBookInfo,
  getTodaysReading,
} from "../utils/scripture-utils";
import { useProfileData } from "../context/ProfileDataProvider";

type ListProps = {
  listNumber: number;
  title: string;
  booksShortNames: string[];
  openList: number;
  setOpenList: Dispatch<SetStateAction<number>>;
};

const List = ({
  listNumber,
  title,
  booksShortNames,
  openList,
  setOpenList,
}: ListProps) => {
  const { bookmarks, setBookmarks, translation } = useProfileData();

  const bookFullNames: string = useMemo(() => {
    return booksShortNames
      .map((shortName) => getBookInfo(shortName).fullName)
      .join(", ");
  }, [booksShortNames]);

  const totalChapters: number = useMemo(() => {
    return booksShortNames.reduce(
      (sum, current) => sum + getBookInfo(current).chapters,
      0
    );
  }, [booksShortNames]);

  const todaysReading: BookChapter | undefined = useMemo(() => {
    return bookmarks
      ? getTodaysReading(bookmarks[listNumber], booksShortNames)
      : undefined;
  }, [bookmarks, listNumber, booksShortNames]);

  const moveBookmark = (): void => {
    if (!bookmarks) return;
    let newBookmarks = [...bookmarks];
    newBookmarks[listNumber] = newBookmarks[listNumber] + 1;
    setBookmarks(newBookmarks);
  };

  return (
    <div className="collapse collapse-arrow bg-base-200">
      {bookmarks && todaysReading && (
        <>
          <input
            type="radio"
            name="my-accordion-2"
            checked={openList === listNumber}
            onClick={() => setOpenList(listNumber)}
          />
          <div className="collapse-title flex items-center">
            <p className="text-xl font-medium">
              List {listNumber + 1}: {title}
            </p>
            <p className="ml-4 text-sm font-sans flex-grow">
              {`Next up: ${todaysReading.fullName} ${todaysReading.chapter}`}
            </p>
            <p className="text-xl font-medium">
              Day {bookmarks[listNumber] % totalChapters} of {totalChapters}
            </p>
          </div>
          <div className="collapse-content flex flex-col items-center">
            <p>Today's reading:</p>
            <p>{`${todaysReading.fullName} ${todaysReading.chapter}`}</p>
            {translation && (
              <div className="flex gap-2 m-2">
                <a
                  className="btn btn-primary"
                  href={`https://www.bible.com/bible/${translation.bibleNum}/${todaysReading.shortName}.${todaysReading.chapter}.${translation?.shortName}`}
                >
                  Read
                </a>
                <a
                  className="btn btn-primary hidden md:inline-flex"
                  href={`https://www.bible.com/audio-bible/${translation.bibleNum}/${todaysReading.shortName}.${todaysReading.chapter}.${translation?.shortName}`}
                >
                  Listen
                </a>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    moveBookmark();
                    setOpenList(listNumber + 1);
                  }}
                >
                  Done
                </button>
              </div>
            )}
            <p className="italic">Books in this section:</p>
            <p className="max-w-2xl italic text-center">{bookFullNames}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default List;
