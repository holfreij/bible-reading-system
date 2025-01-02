import { createContext, useContext, useState, ReactNode, FC } from "react";

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

  const addAudioObject = (newAudio: AudioObject) => {
    if (audioObjects.find((audio) => audio.url === newAudio.url)) return;
    // const sortedAudioObjects = [...audioObjects, newAudio].sort(
    //   sortAudioObjects
    // );
    // setAudioObjects(sortedAudioObjects);
    setAudioObjects((prev) => [...prev, newAudio].sort(sortAudioObjects));
  };

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
