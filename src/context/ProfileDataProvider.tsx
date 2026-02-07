import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { AuthSession } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase-client";
import {
  BibleTranslation,
  BibleTranslations,
} from "../utils/bible-translation";

export type TranslationInfo = Omit<BibleTranslation, "hashes">;

export type User = {
  email: string;
  id: string;
};

interface ProfileDataContextProps {
  bookmarks: number[] | undefined;
  setBookmarks: (bookmarks: number[]) => void;
  translation: TranslationInfo | undefined;
  setTranslation: (translation: TranslationInfo) => void;
  user: User | undefined;
  loading: boolean;
  fetchError: string | undefined;
}

const ProfileDataContext = createContext<ProfileDataContextProps | undefined>(
  undefined
);

const shouldUpdateUser = (
  currentUser: User | undefined,
  newUser: User | undefined
): boolean => {
  if (!currentUser) return true;
  if (!newUser) return false;
  return currentUser.email !== newUser.email || currentUser.id !== newUser.id;
};

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<number[] | undefined>(undefined);
  const [translation, setTranslation] = useState<TranslationInfo | undefined>(
    BibleTranslations[0]
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | undefined>(undefined);

  const [user, setUser] = useState<User | undefined>(undefined);
  const hasFetched = useRef(false);

  useEffect(() => {
    const updateUser = (session: AuthSession | null) => {
      const sessionUser: User | undefined =
        session?.user && session.user.email && session.user.id
          ? { email: session.user.email, id: session.user.id }
          : undefined;

      setUser((currentUser) => {
        if (shouldUpdateUser(currentUser, sessionUser)) {
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
      authStateListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      hasFetched.current = false;
      setLoading(true);
      setFetchError(undefined);

      const { data, error } = await supabase
        .from("profiles")
        .select("username, bookmarks, translation")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        setFetchError(error.message);
      }

      if (!error && data) {
        setBookmarks(data.bookmarks || undefined);
        setTranslation(
          BibleTranslations.find(
            (translation) => translation.shortName === data.translation
          ) || undefined
        );
      }

      hasFetched.current = true;
      setLoading(false);
    }

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setBookmarks(undefined);
      setTranslation(BibleTranslations[0]);
      hasFetched.current = false;
    }
  }, [user]);

  const updateProfile = useCallback(async () => {
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
  }, [user, bookmarks, translation]);

  useEffect(() => {
    if (!hasFetched.current) return;

    const debounceTimer = setTimeout(() => {
      updateProfile();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [updateProfile]);

  return (
    <ProfileDataContext.Provider
      value={{
        bookmarks,
        setBookmarks,
        translation,
        setTranslation,
        user,
        loading,
        fetchError,
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
