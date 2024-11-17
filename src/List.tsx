import { useMemo } from "react";
import { BookChapter, getBookInfo, getTodaysReading } from "./scripture-utils";

type ListProps = {
  listNumber: number;
  title: string;
  booksShortNames: string[];
  day: number;
  totalDays: number;
};

const List = ({ listNumber, title, booksShortNames, day }: ListProps) => {
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
        <div className="p-2">
          <a
            href={`https://www.bible.com/bible/1990/${todaysReading.shortName}.${todaysReading.chapter}.HSV`}
          >
            <button className="m-1 btn btn-primary">Read</button>
          </a>
          <a
            href={`https://www.bible.com/audio-bible/1990/${todaysReading.shortName}.${todaysReading.chapter}.HSV`}
          >
            <button className="m-1 btn btn-primary">Listen</button>
          </a>
        </div>
        <p className="italic">Books in this section:</p>
        <p className="max-w-2xl italic text-center">{bookFullNames}</p>
      </div>
    </div>
  );
};

export default List;
