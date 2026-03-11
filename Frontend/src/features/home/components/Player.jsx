import { useEffect, useRef, useState } from "react";
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
  const { song, loading } = useSong();
  const audioRef = useRef(null);
  const optionsRef = useRef(null);
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

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio || !song?.url || loading) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
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
    setShowOptions(false);
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

  const progress = duration ? `${(currentTime / duration) * 100}%` : "0%";
  const volumeProgress = `${volume * 100}%`;
  const trackTitle = song?.title || "Waiting for the next track";
  const moodLabel = song?.mood || "Unknown mood";
  const playbackStatus = loading
    ? "Curating a new track"
    : isPlaying
      ? "Playing now"
      : "Paused";
  const trackAvailable = Boolean(song?.url);

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

      <div className="player-card__visual">
        <div className="player-card__artwork">
          <img src={song?.posterUrl} alt={song?.title || "Now playing"} />
        </div>
        <span className="player-card__floating-badge player-card__floating-badge--top">
          Mood: {moodLabel}
        </span>
        <span className="player-card__floating-badge player-card__floating-badge--bottom">
          {playbackStatus}
        </span>
      </div>

      <div className="player-card__content">
        <div className="player-card__header">
          <div>
            <p className="player-card__eyebrow">Now playing</p>
            <h2>{trackTitle}</h2>
            <p className="player-card__mood">{moodLabel}</p>
          </div>

          <div className="player-card__options" ref={optionsRef}>
            <button
              className="player-icon-button"
              type="button"
              onClick={() => setShowOptions((prev) => !prev)}
              aria-label="Open player options"
            >
              Menu
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

        <div className="player-card__summary">
          <article>
            <span>Status</span>
            <strong>{playbackStatus}</strong>
          </article>
          <article>
            <span>Duration</span>
            <strong>{formatTime(duration)}</strong>
          </article>
        </div>

        <div className="player-card__progress">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            disabled={!trackAvailable || loading}
            style={{ "--range-progress": progress }}
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
            disabled={!trackAvailable || loading}
          >
            -5
          </button>
          <button
            className="player-play-button"
            type="button"
            onClick={togglePlayback}
            disabled={!trackAvailable || loading}
          >
            {loading ? "Loading..." : isPlaying ? "Pause" : "Play"}
          </button>
          <button
            className="player-icon-button"
            type="button"
            onClick={() => skipTime(5)}
            aria-label="Go forward 5 seconds"
            disabled={!trackAvailable || loading}
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
            style={{ "--range-progress": volumeProgress }}
          />
        </label>
      </div>
    </section>
  );
};

export default Player;
