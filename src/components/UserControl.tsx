import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase-client";
import Auth from "./supabase/Auth";
import Account from "./supabase/Account";

const UserControl = () => {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const openUserProfile = () => {
    if (typeof document !== "undefined" && document !== null) {
      const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
      modal?.showModal();
    } else {
      console.error("Document is not available");
    }
  };

  return (
    <>
      <button className="w-full btn btn-primary" onClick={openUserProfile}>
        <UserCircleIcon className="w-6" />
        {session ? session.user.email : "Log in"}
      </button>
      <dialog id="my_modal_2" className="modal w-full">
        <div className="modal-box">
          {!session ? (
            <Auth />
          ) : (
            <Account key={session.user.id} session={session} />
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default UserControl;
