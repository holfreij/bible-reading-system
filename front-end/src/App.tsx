import Header from "./components/Header";
import Lists from "./components/Lists";
import { ProfileDataProvider } from "./context/ProfileDataProvider";

function App() {
  return (
    <ProfileDataProvider>
      <div className="hero">
        <div className="hero-content flex-col">
          <Header />
          <Lists />
        </div>
      </div>
    </ProfileDataProvider>
  );
}

export default App;
