import { useEffect, useMemo } from "react";
import {
  BookChapter,
  getBookInfo,
  getGlobalChapterNumber,
  getTodaysReading,
} from "../utils/scripture-utils";
import { useProfileData } from "../context/ProfileDataProvider";
import { useAudioContext } from "../context/AudioObjectDataProvider";

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
    let newBookmarks = [...bookmarks];
    newBookmarks[listNumber] = newBookmarks[listNumber] + 1;
    setBookmarks(newBookmarks);
  };

  const listenUrl: string = useMemo(() => {
    if (!todaysReading || !translation) return "";

    const siteUrl = `https://www.bible.com/audio-bible/${translation.bibleNum}/${todaysReading.shortName}.${todaysReading.chapter}.${translation?.shortName}`;

    const globalChapterNumber = getGlobalChapterNumber(todaysReading);
    if (!globalChapterNumber) return siteUrl;

    const audioHash = translation.hashes[globalChapterNumber - 1];
    if (!audioHash) return siteUrl;

    return `https://audio-bible-cdn.youversionapi.com/${translation.audioBibleNum}/32k/${todaysReading.shortName}/${todaysReading.chapter}-${audioHash}.mp3?version_id=${translation.bibleNum}`;
  }, [todaysReading, translation]);

  useEffect(() => {
    addAudioObject({
      url: listenUrl,
      list: listNumber,
      day: bookmarks ? bookmarks[listNumber] : 0,
      book: todaysReading?.fullName || "Unknown book",
      chapter: todaysReading?.chapter || 0,
    });
  }, [todaysReading]);

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
                  href={`https://www.bible.com/bible/${translation.bibleNum}/${todaysReading.shortName}.${todaysReading.chapter}.${translation?.shortName}`}
                >
                  Read
                </a>
                <a className="btn md:inline-flex btn-primary" href={listenUrl}>
                  Listen
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
