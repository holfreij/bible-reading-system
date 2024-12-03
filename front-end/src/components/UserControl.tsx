import { UserCircleIcon } from "@heroicons/react/24/outline";
import Auth from "./supabase/Auth";
import Account from "./supabase/Account";
import { useProfileData } from "../context/ProfileDataProvider";

const UserControl = () => {
  const { user } = useProfileData();

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
        {user ? user.email : "Log in"}
      </button>
      <dialog id="my_modal_2" className="modal w-full">
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
