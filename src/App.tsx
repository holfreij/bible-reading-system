import Header from "./components/Header";
import Lists from "./components/Lists";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./context/ToastProvider";
import { ProfileDataProvider } from "./context/ProfileDataProvider";

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ProfileDataProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-base-100"
          >
            Skip to content
          </a>
          <div className="hero">
            <div className="hero-content flex-col">
              <header>
                <Header />
              </header>
              <main id="main-content">
                <Lists />
              </main>
            </div>
          </div>
        </ProfileDataProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
