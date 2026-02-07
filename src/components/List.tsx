import { useEffect, useMemo, useState } from "react";
import {
  BookChapter,
  getBookInfo,
  getGlobalChapterNumber,
  getTodaysReading,
} from "../utils/scripture-utils";
import { useProfileData } from "../context/ProfileDataProvider";
import { useAudioContext } from "../context/AudioObjectDataProvider";
import { loadTranslationHashes } from "../utils/bible-translation";

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
  const { addAudioObject } = useAudioContext();

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
    const newBookmarks = [...bookmarks];
    newBookmarks[listNumber] = newBookmarks[listNumber] + 1;
    setBookmarks(newBookmarks);
  };

  const [listenUrl, setListenUrl] = useState<string>("");

  useEffect(() => {
    if (!todaysReading || !translation) {
      setListenUrl("");
      return;
    }

    let ignore = false;

    const siteUrl = `https://www.bible.com/audio-bible/${translation.bibleNum}/${todaysReading.shortName}.${todaysReading.chapter}.${translation.shortName}`;

    const globalChapterNumber = getGlobalChapterNumber(todaysReading);
    if (!globalChapterNumber) {
      setListenUrl(siteUrl);
      return;
    }

    loadTranslationHashes(translation.shortName)
      .then((hashes) => {
        if (ignore) return;
        const audioHash = hashes[globalChapterNumber - 1];
        if (!audioHash) {
          setListenUrl(siteUrl);
          return;
        }
        setListenUrl(
          `https://audio-bible-cdn.youversionapi.com/${translation.audioBibleNum}/32k/${todaysReading.shortName}/${todaysReading.chapter}-${audioHash}.mp3?version_id=${translation.bibleNum}`
        );
      })
      .catch(() => {
        if (!ignore) setListenUrl(siteUrl);
      });

    return () => {
      ignore = true;
    };
  }, [todaysReading, translation]);

  const handleAddToQueue = () => {
    if (!todaysReading) return;
    addAudioObject({
      url: listenUrl,
      list: listNumber,
      day: bookmarks ? bookmarks[listNumber] : 0,
      book: todaysReading.fullName,
      chapter: todaysReading.chapter,
    });
  };

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
          <div className="collapse-title flex items-center justify-between">
            <p className="text-xl font-medium">
              List {listNumber + 1}: {title}
            </p>
            <p className="text-xl font-medium">
              {bookmarks[listNumber] % totalChapters}/{totalChapters}
            </p>
          </div>
          <div className="collapse-content flex flex-col items-center">
            <p>Today's reading:</p>
            <p>{`${todaysReading.fullName} ${todaysReading.chapter}`}</p>
            {translation && (
              <div className="flex gap-2 m-2">
                <a
                  className="btn btn-primary"
                  href={`https://www.bible.com/bible/${translation.bibleNum}/${todaysReading.shortName}.${todaysReading.chapter}.${translation.shortName}`}
                >
                  Read
                </a>
                <button
                  className="btn btn-secondary"
                  onClick={handleAddToQueue}
                >
                  Listen
                </button>
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
