import {
  PlayCircleIcon,
  ForwardIcon,
  BackwardIcon,
  PauseCircleIcon,
  QueueListIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import {
  AudioObject,
  useAudioContext,
} from "../context/AudioObjectDataProvider";
import { formatTime } from "../utils/audio-utils";
import { useProfileData } from "../context/ProfileDataProvider";

const AudioControls = () => {
  const audioPlayerRef = useRef<ReactAudioPlayer>(null);

  const [audioIndex, setAudioIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);

  const { audioObjects, removeAudioObject } = useAudioContext();
  const { bookmarks, setBookmarks } = useProfileData();

  const handlePlayPause = () => {
    if (!isPlaying) audioPlayerRef.current?.audioEl.current?.play();
    else audioPlayerRef.current?.audioEl.current?.pause();
    setIsPlaying(!isPlaying);
    setShouldPlay(!isPlaying);
  };

  const handleNext = () => {
    if (!audioObjects || !audioObjects[audioIndex]) return;

    if (audioIndex === audioObjects.length - 1) return;

    setAudioIndex((prev) => prev + 1);
    setShouldPlay(true);
  };

  const handlePrevious = () => {
    if (!audioObjects || !audioObjects[audioIndex]) return;

    if (
      currentTime > 2 &&
      audioPlayerRef.current &&
      audioPlayerRef.current.audioEl.current
    ) {
      audioPlayerRef.current.audioEl.current.currentTime = 0;
      return;
    }

    if (audioIndex === 0) return;

    setAudioIndex((prev) => prev - 1);
    setShouldPlay(true);
  };

  const handleFinish = () => {
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
  };

  const currentAudio: AudioObject | undefined = useMemo(() => {
    if (!audioObjects || !audioObjects[audioIndex]) return undefined;
    return audioObjects[audioIndex];
  }, [audioObjects, audioIndex]);

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
    if (shouldPlay) {
      audioPlayerRef.current?.audioEl.current?.play();
      setIsPlaying(true);
    }
  }, [currentAudio]);

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    let animationFrameId: number;

    const updateTime = () => {
      const currentTime =
        audioPlayerRef.current?.audioEl.current?.currentTime || 0;
      setCurrentTime(currentTime);
      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  return (
    <div className="card bg-base-300 w-96 shadow-xl">
      <div className="card-body p-4">
        <div className="flex flex-col gap-2">
          <ReactAudioPlayer
            onEnded={handleFinish}
            src={currentAudio ? currentAudio.url : ""}
            ref={audioPlayerRef}
          />
          <div className="text-center text-lg">
            {currentAudio
              ? `List ${currentAudio.list + 1} - Day ${currentAudio.day} - ${
                  currentAudio.book
                } ${currentAudio.chapter}`
              : "Audio player unavailable"}
          </div>
          <input
            type="range"
            min={0}
            max={audioPlayerRef.current?.audioEl.current?.duration || 0}
            value={currentTime}
            onChange={(event) => {
              if (
                !audioPlayerRef ||
                !audioPlayerRef.current ||
                !audioPlayerRef.current.audioEl ||
                !audioPlayerRef.current.audioEl.current
              )
                return;
              audioPlayerRef.current.audioEl.current.currentTime =
                +event.target.value;
            }}
            className="range range-xs"
          />
          <div className="flex justify-between">
            <div>{formatTime(currentTime)}</div>
            <div>
              {formatTime(audioPlayerRef.current?.audioEl.current?.duration)}
            </div>
          </div>
          <div className="flex justify-center min-h-20 items-center gap-8">
            <button
              className="btn btn-circle"
              onClick={handlePrevious}
              aria-label="Previous"
            >
              <BackwardIcon />
            </button>
            <button
              className="btn btn-circle w-20 h-20"
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}{" "}
            </button>
            <button
              className="btn btn-circle"
              onClick={handleNext}
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
