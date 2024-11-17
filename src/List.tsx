type ListProps = {
  listNumber: number;
  title: string;
  books?: string[];
  day: number;
  totalDays: number;
};

const List = ({ listNumber, title, books, day, totalDays }: ListProps) => {
  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="radio" name="my-accordion-2" />
      <div className="collapse-title flex items-center">
        <p className="text-xl font-medium">List {listNumber}</p>
        <p className="text-sm font-sans ml-2 flex-grow">{title}</p>
        <p className="text-xl font-medium">
          {day} of {totalDays}
        </p>
      </div>
      <div className="collapse-content">
        <p>hello</p>
      </div>
    </div>
  );
};

export default List;
