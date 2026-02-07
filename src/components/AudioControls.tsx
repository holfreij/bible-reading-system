import {
  PlayCircleIcon,
  ForwardIcon,
  BackwardIcon,
  PauseCircleIcon,
  QueueListIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AudioObject,
  useAudioContext,
} from "../context/AudioObjectDataProvider";
import { formatTime } from "../utils/audio-utils";
import { useProfileData } from "../context/ProfileDataProvider";

const AudioControls = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [audioIndex, setAudioIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { audioObjects, removeAudioObject } = useAudioContext();
  const { bookmarks, setBookmarks } = useProfileData();

  const [currentTime, setCurrentTime] = useState(0);

  const currentAudio: AudioObject | undefined = useMemo(() => {
    if (!audioObjects || !audioObjects[audioIndex]) return undefined;
    return audioObjects[audioIndex];
  }, [audioObjects, audioIndex]);

  const handlePlayPause = useCallback(() => {
    if (!currentAudio) return;
    if (!isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentAudio]);

  const handleNext = useCallback(() => {
    if (!audioObjects || !audioObjects[audioIndex]) return;
    if (audioIndex === audioObjects.length - 1) return;

    setAudioIndex((prev) => prev + 1);
    setIsPlaying(true);
  }, [audioObjects, audioIndex]);

  const handlePrevious = useCallback(() => {
    if (!audioObjects || !audioObjects[audioIndex]) return;

    if (currentTime > 2 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (audioIndex === 0) return;

    setAudioIndex((prev) => prev - 1);
    setIsPlaying(true);
  }, [audioObjects, audioIndex, currentTime]);

  const handleFinish = useCallback(() => {
    if (!currentAudio) return;
    if (!bookmarks) return;

    const newBookmarks = [...bookmarks];
    newBookmarks[currentAudio.list] = newBookmarks[currentAudio.list] + 1;
    setBookmarks(newBookmarks);

    const removedIndex = audioObjects.indexOf(currentAudio);
    removeAudioObject(currentAudio);

    // Adjust audioIndex to stay valid after removal
    setAudioIndex((prev) => {
      const newLength = audioObjects.length - 1;
      if (newLength === 0) return 0;
      if (removedIndex < prev) return prev - 1;
      if (prev >= newLength) return newLength - 1;
      return prev;
    });
  }, [currentAudio, bookmarks, setBookmarks, audioObjects, removeAudioObject]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      const { mediaSession } = navigator;

      if (currentAudio) {
        mediaSession.metadata = new MediaMetadata({
          title: `${currentAudio.book} ${currentAudio.chapter}`,
          artist: `God`,
          album: `List ${currentAudio.list + 1} - Day ${currentAudio.day}`,
        });
      }

      mediaSession.setActionHandler("play", () => {
        handlePlayPause();
      });
      mediaSession.setActionHandler("pause", () => {
        handlePlayPause();
      });
      mediaSession.setActionHandler("previoustrack", () => {
        handlePrevious();
      });
      mediaSession.setActionHandler("nexttrack", () => {
        handleNext();
      });
    }
  }, [currentAudio, handlePlayPause, handleNext, handlePrevious]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAudio]);

  useEffect(() => {
    if (!isPlaying) return;

    let animationFrameId: number;

    const updateTime = () => {
      const currentTime = audioRef.current?.currentTime || 0;
      setCurrentTime(currentTime);
      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  return (
    <div className="card bg-base-300 w-full max-w-96 shadow-xl">
      <div className="card-body p-4">
        <div className="flex flex-col gap-2">
          <audio
            ref={audioRef}
            src={currentAudio ? currentAudio.url : ""}
            onEnded={handleFinish}
          />
          <div className="text-center text-lg">
            {currentAudio
              ? `List ${currentAudio.list + 1} - Day ${currentAudio.day} - ${
                  currentAudio.book
                } ${currentAudio.chapter}`
              : 'Press "Listen" on a reading to add to queue'}
          </div>
          <input
            type="range"
            min={0}
            max={audioRef.current?.duration || 0}
            value={currentTime}
            onChange={(event) => {
              if (!audioRef.current) return;
              audioRef.current.currentTime = +event.target.value;
            }}
            className="range range-xs"
            aria-label="Seek"
          />
          <div className="flex justify-between">
            <div>{formatTime(currentTime)}</div>
            <div>{formatTime(audioRef.current?.duration)}</div>
          </div>
          <div className="flex justify-center min-h-20 items-center gap-8">
            <button
              className="btn btn-circle"
              onClick={handlePrevious}
              disabled={!currentAudio}
              aria-label="Previous"
            >
              <BackwardIcon />
            </button>
            <button
              className="btn btn-circle w-20 h-20"
              onClick={handlePlayPause}
              disabled={!currentAudio}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}{" "}
            </button>
            <button
              className="btn btn-circle"
              onClick={handleNext}
              disabled={!currentAudio}
              aria-label="Next"
            >
              <ForwardIcon />
            </button>
          </div>
          <div className="flex justify-center gap-4">
            <div className="bg-base-200 collapse">
              <input type="checkbox" className="peer" />
              <div className="collapse-title pr-4">
                <div className="flex justify-between items-center">
                  <QueueListIcon className="h-8" />
                  Queue
                  <ChevronUpDownIcon className="h-8" />
                </div>
              </div>
              <div className="collapse-content ">
                <ul className="list-none p-0 m-0 space-y-4 overflow-y-auto max-h-[400px]">
                  {audioObjects.map((track, index) => (
                    <li key={index}>
                      <button
                        onClick={() => setAudioIndex(index)}
                        className="btn btn-primary flex justify-between w-full"
                      >
                        <span>{`${track.book} ${track.chapter}`}</span>
                        <span>{`List ${track.list + 1} - Day ${track.day}`}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioControls;
