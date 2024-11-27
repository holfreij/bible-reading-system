import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../utils/supabase-client";
import {
  BibleTranslation,
  BibleTranslations,
} from "../utils/bible-translation";
import { Session, User } from "@supabase/supabase-js";

interface ProfileDataContextProps {
  bookmarks: number[];
  setBookmarks: (bookmarks: number[]) => void;
  translation: BibleTranslation;
  setTranslation: (translation: BibleTranslation) => void;
  session: Session | null;
  loading: boolean;
}

const ProfileDataContext = createContext<ProfileDataContextProps | undefined>(
  undefined
);

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<number[]>([
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ]);
  const [translation, setTranslation] = useState<BibleTranslation>(
    BibleTranslations[0]
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [user, setUser] = useState<User>();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setUser(session.user);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setUser(session.user);
    });
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("username, bookmarks, translation")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setBookmarks(data.bookmarks || []);
        setTranslation(
          BibleTranslations.find(
            (translation) => translation.shortName === data.translation
          ) || BibleTranslations[0]
        );
      }

      setLoading(false);
    }

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const syncData = async () => {
        if (!user?.id) return;
        await updateProfile();
      };
      syncData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [bookmarks, translation]);

  const updateProfile = async () => {
    if (!user) return;

    const updates = {
      id: user.id,
      bookmarks,
      translation: translation.shortName,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);
    if (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <ProfileDataContext.Provider
      value={{
        bookmarks,
        setBookmarks,
        translation,
        setTranslation,
        session,
        loading,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
};

export const useProfileData = () => {
  const context = useContext(ProfileDataContext);
  if (!context) {
    throw new Error("useProfileData must be used within a ProfileDataProvider");
  }
  return context;
};
