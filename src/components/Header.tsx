import UserControl from "./UserControl";

const Header = () => {
  return (
    <div>
      <h1 className="text-center text-5xl font-bold">Bible Reading System</h1>
      <div className="flex flex-col gap-2 p-4">
        <p className="text-center">
          Digital bookmark system for Professor Grant Horner's{" "}
          <a
            className="underline"
            href="https://sohmer.net/media/professor_grant_horners_bible_reading_system.pdf"
          >
            Bible-Reading System
          </a>
        </p>
        <p className="text-center">
          {`All scripture text and audio is used with the courtesy of `}
          <a className="underline" href="https://www.bible.com/">
            Bible.com
          </a>
          {` by `}
          <a className="underline" href="https://www.youversion.com/">
            YouVersion
          </a>
        </p>
      </div>
      <UserControl />
    </div>
  );
};

export default Header;
