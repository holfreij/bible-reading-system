import UserControl from "./UserControl";

const Header = () => {
  return (
    <div>
      <h1 className="text-center text-5xl font-bold">Bible Reading System</h1>
      <p className="text-center py-6">
        Digital bookmark system for Professor Grant Horner's{" "}
        <a
          className="underline"
          href="https://sohmer.net/media/professor_grant_horners_bible_reading_system.pdf"
        >
          Bible-Reading System
        </a>
      </p>
      <UserControl />
    </div>
  );
};

export default Header;
