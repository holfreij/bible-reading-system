import {
  PlayCircleIcon,
  ForwardIcon,
  BackwardIcon,
  ChevronDownIcon,
  StopCircleIcon,
} from "@heroicons/react/24/solid";

const AudioControls = () => {
  return (
    <div className="card bg-base-300 w-96 shadow-xl">
      <div className="card-body p-4">
        <div className="flex flex-col gap-2">
          <div className="text-center text-lg">
            Day XXX - List X - Matthew 1
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value="40"
            className="range range-xs"
          />
          <div className="flex justify-between">
            <div>0:40</div>
            <div>3:21</div>
          </div>
          <div className="flex justify-center min-h-20 items-center gap-8">
            <button className="btn btn-circle">
              <BackwardIcon />
            </button>
            <button className="btn btn-circle w-20 h-20">
              <PlayCircleIcon />
            </button>
            <button className="btn btn-circle">
              <ForwardIcon />
            </button>
          </div>
          <div className="flex justify-center gap-4">
            <label className="grid cursor-pointer place-items-center">
              <input
                type="checkbox"
                value="synthwave"
                className="toggle bg-base-content col-span-2 col-start-1 row-start-1"
              />
              <StopCircleIcon className="stroke-base-100 fill-base-100 col-start-1 row-start-1" />
              <PlayCircleIcon className="stroke-base-100 fill-base-100 col-start-2 row-start-1" />
            </label>
            <button className="btn btn-circle w-8">
              <ChevronDownIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioControls;
