import { Session } from "@supabase/supabase-js";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";
import { useBookmarks } from "../../context/BookmarksContext";
import { BibleTranslations } from "../../utils/bible-translation";
import { useTranslationShortNames } from "../../context/BibleTranslationContext";

type AccountProps = {
  session: Session;
};

export default function Account({ session }: AccountProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const { shortName: translation, setShortName } = useTranslationShortNames();
  const { bookmarks, setBookmarks } = useBookmarks();

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, bookmarks, translation`)
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setBookmarks(data.bookmarks);
          setShortName(data.translation);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      bookmarks,
      translation,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      alert(error.message);
    }
    setLoading(false);
  }

  const handleBookmarkChange = (index: number, value: number) => {
    const updatedBookmarks = bookmarks ? [...bookmarks] : [];

    updatedBookmarks[index] = value;

    setBookmarks(updatedBookmarks);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-medium text-lg text-center">
        Update your profile and bookmarks
      </p>
      <form
        onSubmit={updateProfile}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex flex-col gap-2">
          <p className="font-medium text-center">Personal Information</p>
          <label className="input input-bordered flex items-center gap-2 w-60">
            <p className="font-medium">Email</p>
            <input
              id="email"
              type="email"
              autoComplete="off"
              className="grow"
              value={session.user.email}
              disabled
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 w-60">
            <p className="font-medium">Name</p>
            <input
              id="username"
              type="text"
              autoComplete="off"
              required
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-medium text-center">Bible Settings</p>

          <select
            id="translation"
            value={translation}
            onChange={(e) => {
              setShortName(e.target.value);
            }}
            className="select select-bordered w-full max-w-xs"
          >
            {Object.values(BibleTranslations).map((translation) => (
              <option key={translation.shortName} value={translation.shortName}>
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
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Loading ..." : "Update"}
          </button>

          <button
            className="btn btn-error btn-outline"
            type="button"
            onClick={() => {
              supabase.auth.signOut();
              setBookmarks([]);
            }}
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
}
