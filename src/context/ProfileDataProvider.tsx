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

export type User = {
  email: string;
  id: string;
};

interface ProfileDataContextProps {
  bookmarks: number[] | undefined;
  setBookmarks: (bookmarks: number[]) => void;
  translation: BibleTranslation | undefined;
  setTranslation: (translation: BibleTranslation) => void;
  user: User | undefined;
  loading: boolean;
}

const ProfileDataContext = createContext<ProfileDataContextProps | undefined>(
  undefined
);

const setNewUser = (
  currentUser: User | undefined,
  newUser: User | undefined
): boolean => {
  if (!currentUser) return true;
  if (!newUser) return false;
  return currentUser.email !== newUser.email || currentUser.id !== newUser.id;
};

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<number[] | undefined>(undefined);
  const [translation, setTranslation] = useState<BibleTranslation | undefined>(
    BibleTranslations[0]
  );
  const [loading, setLoading] = useState<boolean>(true);

  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const updateUser = (session: any) => {
      const sessionUser: User | undefined =
        session?.user && session.user.email && session.user.id
          ? { email: session.user.email, id: session.user.id }
          : undefined;

      setUser((currentUser) => {
        if (setNewUser(currentUser, sessionUser)) {
          return sessionUser;
        }
        return currentUser;
      });
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUser(session);
    });

    const { data: authStateListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateUser(session);
      }
    );

    return () => {
      authStateListener?.subscription.unsubscribe(); // Clean up the listener
    };
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
        setBookmarks(data.bookmarks || undefined);
        setTranslation(
          BibleTranslations.find(
            (translation) => translation.shortName === data.translation
          ) || undefined
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
      translation: translation ? translation.shortName : "",
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
        user,
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
