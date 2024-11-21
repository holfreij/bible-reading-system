import { Session } from "@supabase/supabase-js";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";

type AccountProps = {
  session: Session;
};

export default function Account({ session }: AccountProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, bookmarks`)
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setBookmarks(data.bookmarks);
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

    while (updatedBookmarks.length <= index) {
      updatedBookmarks.push(0); // Default value
    }

    updatedBookmarks[index] = value;

    setBookmarks(updatedBookmarks);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-medium text-lg">Update your profile and bookmarks</p>
      <form
        onSubmit={updateProfile}
        className="flex flex-col items-center gap-2"
      >
        <label
          htmlFor="email"
          className="input input-bordered flex items-center gap-2 w-60"
        >
          Email
          <input
            id="email"
            type="email"
            className="grow"
            value={session.user.email}
            disabled
          />
        </label>
        <label
          htmlFor="username"
          className="input input-bordered flex items-center gap-2 w-60"
        >
          Name
          <input
            id="username"
            type="text"
            required
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        {bookmarks &&
          bookmarks.map((bookmark, index) => (
            <label
              key={index}
              htmlFor="bookmarks"
              className="input input-bordered flex items-center gap-2"
            >
              <p className="font-bold">Bookmark {index + 1}</p>
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

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Loading ..." : "Update"}
        </button>

        <button
          className="btn btn-error btn-outline"
          type="button"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
