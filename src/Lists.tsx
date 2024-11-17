import { useState } from "react";
import List from "./List";

const Lists = () => {
  const [day, setDay] = useState<number>(1);
  return (
    <>
      <button className="btn" onClick={() => setDay(day + 1)}>
        Day + 1
      </button>
      <List
        listNumber={1}
        title="Gospels"
        booksShortNames={["MAT", "MRK", "LUK", "JHN"]}
        // title="Matthew Mark, Luke, John"
        day={day}
        totalDays={89}
      />
      <List
        listNumber={2}
        title="Pentateuch"
        booksShortNames={["GEN", "EXO", "LEV", "NUM", "DEU"]}
        // title="Genesis, Exodus, Leviticus, Numbers, Deuteronomy"
        day={day}
        totalDays={187}
      />
      <List
        listNumber={3}
        title="Epistles - Part I"
        booksShortNames={[
          "ROM",
          "1CO",
          "2CO",
          "GAL",
          "EPH",
          "PHP",
          "COL",
          "HEB",
        ]}
        // title="Romans, I&II Cor, Gal, Eph, Phil, Col, Hebrews"
        day={day}
        totalDays={78}
      />
      <List
        listNumber={4}
        totalDays={65}
        title="Epistles - Part II"
        booksShortNames={[
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
        ]}
        // title="I&II Thess, I&II Tim, Titus, Philemon, James, I&II Peter,
        // I,II&III John, Jude, Revelation"
        day={day}
      />
      <List
        listNumber={5}
        title="Wisdom"
        booksShortNames={["JOB", "ECC", "SNG"]}
        // title="Job, Ecclesiastes, Song of Solomon"
        day={day}
        totalDays={62}
      />
      <List
        listNumber={6}
        title="Psalms"
        booksShortNames={["PSA"]}
        day={day}
        totalDays={150}
      />
      <List
        listNumber={7}
        title="Proverbs"
        booksShortNames={["PRO"]}
        day={day}
        totalDays={31}
      />
      <List
        listNumber={8}
        title="History"
        booksShortNames={[
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
        ]}
        // title="Joshua, Judges, Ruth, I&II Samuel, I&II Kings, I&II
        // Chronicles, Ezra, Nehemiah, Esther"
        day={day}
        totalDays={249}
      />
      <List
        listNumber={9}
        title="Prophets"
        booksShortNames={[
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
        ]}
        // title="Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel, Hosea, Joel,
        // Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi"
        day={day}
        totalDays={250}
      />
      <List
        listNumber={10}
        title="Acts"
        booksShortNames={["ACT"]}
        day={day}
        totalDays={28}
      />
    </>
  );
};

export default Lists;
