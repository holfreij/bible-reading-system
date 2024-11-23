import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type BookmarksContextType = {
  bookmarks: number[] | null;
  setBookmarks: Dispatch<SetStateAction<number[] | null>>;
};

const BookmarksContext = createContext<BookmarksContextType | undefined>(
  undefined
);

export const BookmarksProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<number[] | null>(null);

  return (
    <BookmarksContext.Provider value={{ bookmarks, setBookmarks }}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  }
  return context;
};
