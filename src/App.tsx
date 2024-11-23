import Header from "./components/Header";
import Lists from "./components/Lists";
import { BibleTranslationProvider } from "./context/BibleTranslationContext";
import { BookmarksProvider } from "./context/BookmarksContext";

function App() {
  return (
    <BookmarksProvider>
      <BibleTranslationProvider>
        <div className="hero">
          <div className="hero-content flex-col">
            <Header />
            <Lists />
          </div>
        </div>
      </BibleTranslationProvider>
    </BookmarksProvider>
  );
}

export default App;
