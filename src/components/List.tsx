import { useMemo } from "react";
import {
  BookChapter,
  getBookInfo,
  getTodaysReading,
} from "../utils/scripture-utils";
import { useTranslationShortNames } from "../context/BibleTranslationContext";
import { BibleTranslations } from "../utils/bible-translation";

type ListProps = {
  listNumber: number;
  title: string;
  booksShortNames: string[];
  day: number;
  totalDays: number;
};

const List = ({ listNumber, title, booksShortNames, day }: ListProps) => {
  const { shortName } = useTranslationShortNames();

  const translationInfo = BibleTranslations.find(
    (translation) => translation.shortName === shortName
  );

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

  const todaysReading: BookChapter = useMemo(() => {
    return getTodaysReading(day, booksShortNames);
  }, [day, booksShortNames]);

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="radio" name="my-accordion-2" />
      <div className="collapse-title flex items-center">
        <p className="text-xl font-medium">
          List {listNumber}: {title}
        </p>
        <p className="ml-4 text-sm font-sans flex-grow">
          {`Next up: ${todaysReading.fullName} ${todaysReading.chapter}`}
        </p>
        <p className="text-xl font-medium">
          Day {day % totalChapters} of {totalChapters}
        </p>
      </div>
      <div className="collapse-content flex flex-col items-center">
        <p>Today's reading:</p>
        <p>{`${todaysReading.fullName} ${todaysReading.chapter}`}</p>
        {translationInfo && (
          <div className="p-2">
            <a
              className="btn m-1 btn-primary"
              href={`https://www.bible.com/bible/${translationInfo.bibleNum}/${todaysReading.shortName}.${todaysReading.chapter}.${translationInfo?.shortName}`}
            >
              Read
            </a>
            <a
              className="m-1 btn btn-primary"
              href={`https://www.bible.com/audio-bible/${translationInfo.bibleNum}/${todaysReading.shortName}.${todaysReading.chapter}.${translationInfo?.shortName}`}
            >
              Listen
            </a>
          </div>
        )}
        <p className="italic">Books in this section:</p>
        <p className="max-w-2xl italic text-center">{bookFullNames}</p>
      </div>
    </div>
  );
};

export default List;
