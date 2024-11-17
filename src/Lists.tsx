import List from "./List";

const Lists = () => {
  return (
    <>
      <List
        listNumber={1}
        title="Gospels"
        // title="Matthew, Mark, Luke, John"
        day={0}
        totalDays={89}
      />
      <List
        listNumber={2}
        title="Pentateuch"
        // title="Genesis, Exodus, Leviticus, Numbers, Deuteronomy"
        day={0}
        totalDays={187}
      />
      <List
        listNumber={3}
        title="Epistles - Part I"
        // title="Romans, I&II Cor, Gal, Eph, Phil, Col, Hebrews"
        day={0}
        totalDays={78}
      />
      <List
        listNumber={4}
        totalDays={65}
        title="Epistles - Part II"
        // title="I&II Thess, I&II Tim, Titus, Philemon, James, I&II Peter,
        // I,II&III John, Jude, Revelation"
        day={0}
      />
      <List
        listNumber={5}
        title="Wisdom"
        // title="Job, Ecclesiastes, Song of Solomon"
        day={0}
        totalDays={62}
      />
      <List listNumber={6} title="Psalms" day={0} totalDays={150} />
      <List listNumber={7} title="Proverbs" day={0} totalDays={31} />
      <List
        listNumber={8}
        title="History"
        // title="Joshua, Judges, Ruth, I&II Samuel, I&II Kings, I&II
        // Chronicles, Ezra, Nehemiah, Esther"
        day={0}
        totalDays={249}
      />
      <List
        listNumber={9}
        title="Prophets"
        // title="Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel, Hosea, Joel,
        // Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi"
        day={0}
        totalDays={250}
      />
      <List listNumber={10} title="Acts" day={0} totalDays={28} />
    </>
  );
};

export default Lists;
