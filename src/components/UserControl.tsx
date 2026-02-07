import { useRef } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Auth from "./supabase/Auth";
import Account from "./supabase/Account";
import { useProfileData } from "../context/ProfileDataProvider";

const UserControl = () => {
  const { user } = useProfileData();
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="w-full btn btn-primary"
        onClick={() => modalRef.current?.showModal()}
      >
        <UserCircleIcon className="w-6" />
        {user ? user.email : "Log in"}
      </button>
      <dialog ref={modalRef} className="modal w-full">
        <div className="modal-box">
          {!user ? <Auth /> : <Account key={user.id} />}
          <form className="flex justify-center mt-4" method="dialog">
            <button className="btn btn-primary">Close</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default UserControl;
