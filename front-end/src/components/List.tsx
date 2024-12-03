import { useEffect, useMemo, useState } from "react";
import {
  BookChapter,
  getBookInfo,
  getTodaysReading,
} from "../utils/scripture-utils";
import { useProfileData } from "../context/ProfileDataProvider";
import { getAudioFileUrl } from "../utils/audio";

type ListProps = {
  listNumber: number;
  title: string;
  booksShortNames: string[];
  openList: number;
  onChangeOpenList: (newOpenList: number) => void;
};

const List = ({
  listNumber,
  title,
  booksShortNames,
  openList,
  onChangeOpenList,
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

  const [listenUrl, setListenUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getListenUrl = async (baseUrl: string) => {
      try {
        const audioFileUrl = await getAudioFileUrl(baseUrl);
        setListenUrl(audioFileUrl ?? baseUrl);
        setLoading(false);
      } catch (error) {
        setListenUrl(baseUrl);
        console.error("Error fetching data:", error);
      }
    };

    if (!todaysReading || !translation || openList !== listNumber) return;
    const baseUrl = `https://www.bible.com/audio-bible/${translation.bibleNum}/${todaysReading.shortName}.${todaysReading.chapter}.${translation?.shortName}`;

    setLoading(true);
    getListenUrl(baseUrl);
  }, [todaysReading, translation, openList]);

  return (
    <div className="collapse collapse-arrow bg-base-200">
      {bookmarks && todaysReading && (
        <>
          <input
            type="radio"
            name="my-accordion-2"
            checked={openList === listNumber}
            onChange={() => onChangeOpenList(listNumber)}
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
                  className={
                    `btn md:inline-flex ` +
                    (loading ? "btn-disabled" : "btn-primary")
                  }
                  href={listenUrl}
                  onClick={(e) => {
                    if (loading) e.preventDefault();
                  }}
                >
                  {loading ? "Loading" : "Listen"}
                </a>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    moveBookmark();
                    onChangeOpenList(listNumber + 1);
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
