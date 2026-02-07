import { BibleTranslations } from "../../utils/bible-translation";
import { useProfileData } from "../../context/ProfileDataProvider";
import { useToast } from "../../context/ToastProvider";
import { supabase } from "../../utils/supabase-client";

export default function Account() {
  const { bookmarks, setBookmarks, translation, setTranslation, user } =
    useProfileData();
  const { addToast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    addToast("Signed out", "info");
  };

  const handleBookmarkChange = (index: number, value: number) => {
    const updatedBookmarks = bookmarks ? [...bookmarks] : [];

    updatedBookmarks[index] = value;

    setBookmarks(updatedBookmarks);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {!user ? (
        <p className="font-medium text-lg text-center">
          You need to be logged in to use this profile menu
        </p>
      ) : (
        <>
          <p className="font-medium text-lg text-center">
            Update your profile and bookmarks
          </p>
          <form className="flex flex-col items-center gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-center">Personal Information</p>
              <label className="input input-bordered flex items-center gap-2 w-60">
                <p className="font-medium">Email</p>
                <input
                  id="email"
                  type="email"
                  autoComplete="off"
                  className="grow"
                  value={user.email}
                  disabled
                />
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-center">Bible Settings</p>

              <select
                id="translation"
                value={translation ? translation.shortName : ""}
                onChange={(e) => {
                  setTranslation(
                    BibleTranslations.find(
                      (translation) => translation.shortName === e.target.value
                    ) || BibleTranslations[0]
                  );
                }}
                className="select select-bordered w-full max-w-xs"
              >
                {Object.values(BibleTranslations).map((translation) => (
                  <option
                    key={translation.shortName}
                    value={translation.shortName}
                  >
                    {`${translation.fullName} (${translation.language})`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col  gap-2">
              <p className="font-medium text-center">Bookmarks</p>
              {bookmarks &&
                bookmarks.map((bookmark, index) => (
                  <label
                    key={index}
                    className="input input-bordered flex items-center gap-2"
                  >
                    <p className="font-medium">Bookmark {index + 1}</p>
                    <p>- Day</p>
                    <input
                      className="w-14"
                      id={`bookmark${index}`}
                      type="number"
                      min={0}
                      max={99999}
                      required
                      value={bookmark}
                      onChange={(event) =>
                        handleBookmarkChange(index, +event.target.value)
                      }
                    />
                  </label>
                ))}
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="btn btn-error btn-outline"
                type="button"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
