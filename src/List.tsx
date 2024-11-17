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
        <p className="text-xl font-medium">List {listNumber}</p>
        <p className="text-lg font-sans ml-2 flex-grow">{title}</p>
        <p className="text-xl font-medium">
          {day} of {totalChapters}
        </p>
      </div>
      <div className="collapse-content">
        <p>{bookFullNames}</p>
        <p>Today's book: {todaysReading.book}</p>
        <p>Today's chapter: {todaysReading.chapter}</p>
      </div>
    </div>
  );
};

export default List;
