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

    let newBookmarks = [...bookmarks];
    newBookmarks[currentAudio.list] = newBookmarks[currentAudio.list] + 1;
    setBookmarks(newBookmarks);

    removeAudioObject(currentAudio);
  };

  // Add new chapter from list to queue when current one from list finishes

  // Clear queue on translation change or logout

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
    let animationFrameId: number;

    const updateTime = () => {
      const currentTime =
        audioPlayerRef.current?.audioEl.current?.currentTime || 0;
      setCurrentTime(currentTime);
      animationFrameId = requestAnimationFrame(updateTime);
    };

    // Start updating time when the component mounts
    animationFrameId = requestAnimationFrame(updateTime);

    // Cleanup on unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, [audioPlayerRef, audioPlayerRef.current?.audioEl]);

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
            <button className="btn btn-circle" onClick={handlePrevious}>
              <BackwardIcon />
            </button>
            <button
              className="btn btn-circle w-20 h-20"
              onClick={handlePlayPause}
            >
              {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}{" "}
            </button>
            <button className="btn btn-circle" onClick={handleNext}>
              <ForwardIcon />
            </button>
          </div>
          <div className="flex justify-center gap-4">
            {/* <label className="grid cursor-pointer place-items-center">
              <input
                type="checkbox"
                value="synthwave"
                className="toggle bg-base-content col-span-2 col-start-1 row-start-1"
              />
              <StopCircleIcon className="stroke-base-100 fill-base-100 col-start-1 row-start-1" />
              <PlayCircleIcon className="stroke-base-100 fill-base-100 col-start-2 row-start-1" />
            </label> */}

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
                <ul className="list-none p-0 m-0 space-y-4 overflow-y-auto max-h-[600px]">
                  {audioObjects.map((track, index) => (
                    <li key={index}>
                      <div
                        onClick={() => setAudioIndex(index)}
                        className="btn btn-primary flex justify-between"
                      >
                        <div>{`${track.book} ${track.chapter}`}</div>
                        <div>{`List ${track.list} - Day ${track.day}`}</div>
                      </div>
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
