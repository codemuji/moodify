import { useContext, useEffect, useRef, useState } from "react";
import { songContext } from "../song.context";
import { useSong } from "../hooks/useSong";
import "../styles/player.scss";

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

const Player = () => {
  const { song } = useSong();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.load();
    audio.currentTime = 0;
    audio.volume = volume;
    setIsPlaying(false);
    setCurrentTime(0);
  }, [song?.url]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }

  function skipTime(seconds) {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const nextTime = Math.min(
      Math.max(audio.currentTime + seconds, 0),
      audio.duration || 0,
    );

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handleSeek(event) {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);

    if (!audio) {
      return;
    }

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  return (
    <section className="player-card">
      <audio
        ref={audioRef}
        src={song?.url}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onEnded={() => setIsPlaying(false)}
      />

      <div className="player-card__artwork">
        <img src={song?.posterUrl} alt={song?.title || "Now playing"} />
      </div>

      <div className="player-card__content">
        <div className="player-card__header">
          <div>
            <p className="player-card__eyebrow">Now playing</p>
            <h2>{song?.title || "Untitled track"}</h2>
            <p className="player-card__mood">{song?.mood || "Unknown mood"}</p>
          </div>

          <div className="player-card__options">
            <button
              className="player-icon-button"
              type="button"
              onClick={() => setShowOptions((prev) => !prev)}
              aria-label="Open player options"
            >
              ...
            </button>

            {showOptions ? (
              <div className="player-card__menu">
                <button type="button" onClick={() => skipTime(-5)}>
                  Replay 5 sec
                </button>
                <button type="button" onClick={() => skipTime(5)}>
                  Skip 5 sec
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const audio = audioRef.current;

                    if (!audio) {
                      return;
                    }

                    audio.currentTime = 0;
                    setCurrentTime(0);
                    setShowOptions(false);
                  }}
                >
                  Restart
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="player-card__progress">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
          />
          <div className="player-card__time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-card__controls">
          <button
            className="player-icon-button"
            type="button"
            onClick={() => skipTime(-5)}
            aria-label="Go backward 5 seconds"
          >
            -5
          </button>
          <button
            className="player-play-button"
            type="button"
            onClick={togglePlayback}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            className="player-icon-button"
            type="button"
            onClick={() => skipTime(5)}
            aria-label="Go forward 5 seconds"
          >
            +5
          </button>
        </div>

        <label className="player-card__volume" htmlFor="player-volume">
          <span>Volume</span>
          <input
            id="player-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </label>
      </div>
    </section>
  );
};

export default Player;
