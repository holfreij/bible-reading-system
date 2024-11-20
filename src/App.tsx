import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Lists from "./components/Lists";
import Account from "./components/supabase/Account";
import Auth from "./components/supabase/Auth";
import { supabase } from "./utils/supabase-client";

function App() {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="hero">
      <div className="hero-content flex-col">
        <div className="container" style={{ padding: "50px 0 100px 0" }}>
          {!session ? (
            <Auth />
          ) : (
            <Account key={session.user.id} session={session} />
          )}
        </div>
        <Header />
        <Lists />
      </div>
    </div>
  );
}

export default App;
