import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";
import { useToast } from "./ToastProvider";

export type AudioObject = {
  url: string;
  list: number;
  day: number;
  book: string;
  chapter: number;
};

type AudioContextType = {
  audioObjects: AudioObject[];
  addAudioObject: (newAudio: AudioObject) => void;
  addAudioObjects: (newAudios: AudioObject[]) => void;
  removeAudioObject: (removeAudio: AudioObject) => void;
  clearAudioQueue: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const sortAudioObjects = (a: AudioObject, b: AudioObject): number => {
  if (a.day < b.day) return -1;
  if (a.day > b.day) return 1;
  if (a.list < b.list) return -1;
  if (a.list > b.list) return 1;
  return 0;
};

export const AudioProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [audioObjects, setAudioObjects] = useState<AudioObject[]>([]);
  const { addToast } = useToast();

  const addAudioObject = (newAudio: AudioObject) => {
    if (audioObjects.find((audio) => audio.url === newAudio.url)) {
      addToast("Already in queue", "info");
      return;
    }
    setAudioObjects((prev) => [...prev, newAudio].sort(sortAudioObjects));
    addToast(`Added ${newAudio.book} ${newAudio.chapter} to queue`, "success");
  };

  const addAudioObjects = useCallback((newAudios: AudioObject[]) => {
    setAudioObjects((prev) => {
      const existingUrls = new Set(prev.map((a) => a.url));
      const toAdd = newAudios.filter((a) => !existingUrls.has(a.url));
      if (toAdd.length === 0) return prev;
      return [...prev, ...toAdd].sort(sortAudioObjects);
    });
  }, []);

  const removeAudioObject = (removeAudio: AudioObject) => {
    setAudioObjects((prev) => prev.filter((audio) => audio !== removeAudio));
  };

  const clearAudioQueue = () => {
    setAudioObjects([]);
  };

  return (
    <AudioContext.Provider
      value={{
        audioObjects,
        addAudioObject,
        addAudioObjects,
        removeAudioObject,
        clearAudioQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
