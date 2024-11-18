import Lists from "./Lists";
import Header from "./Header";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => console.log(countries), [countries]);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    if (!data) return;
    setCountries(data);
  }

  console.log();

  return (
    <div className="hero">
      <div className="hero-content flex-col">
        <Header />
        <Lists />
      </div>
    </div>
  );
}

export default App;
