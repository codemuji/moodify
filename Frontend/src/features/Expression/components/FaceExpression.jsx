import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import "../styles/face-expression.scss";

const scanningTips = [
  "Face the camera directly",
  "Use even lighting",
  "Hold still for one second",
];

export default function FaceExpression({
  onClick = () => {},
  loading = false,
  currentMood = "happy",
}) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const [expression, setExpression] = useState("Waiting for scan");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraStatus, setCameraStatus] = useState(
    "Starting the camera and face model...",
  );
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let activeLandmarker = null;
    let activeStream = null;

    async function setupCamera() {
      try {
        await init({ landmarkerRef, videoRef, streamRef });
        activeLandmarker = landmarkerRef.current;
        activeStream = streamRef.current;

        if (!isMounted) {
          return;
        }

        setCameraReady(true);
        setCameraStatus("Camera ready. Scan your expression to fetch a track.");
      } catch {
        if (!isMounted) {
          return;
        }

        setCameraReady(false);
        setExpression("Camera unavailable");
        setCameraStatus("Allow camera access and reload the page to continue.");
      }
    }

    setupCamera();

    return () => {
      isMounted = false;

      if (activeLandmarker) {
        activeLandmarker.close();
      }

      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function handleClick() {
    if (!cameraReady || loading || isDetecting) {
      return;
    }

    setIsDetecting(true);

    const detectedExpression = detect({ landmarkerRef, videoRef, setExpression });

    if (!detectedExpression) {
      setCameraStatus("No clear face detected. Recenter and try again.");
      setIsDetecting(false);
      return;
    }

    setCameraStatus(`Expression locked: ${detectedExpression}. Matching music...`);

    try {
      await onClick(detectedExpression);
      setCameraStatus(
        `Track updated for ${detectedExpression}. Run another scan any time.`,
      );
    } finally {
      setIsDetecting(false);
    }
  }

  return (
    <section className="face-card">
      <div className="face-card__header">
        <div>
          <span className="face-card__eyebrow">Mood scanner</span>
          <h2>Read the face, then cue the right song.</h2>
        </div>
        <span
          className={`face-card__status${cameraReady ? " face-card__status--ready" : ""}`}
        >
          {cameraReady ? "Camera ready" : "Initializing"}
        </span>
      </div>

      <p className="face-card__description">
        Use the live camera feed to detect an expression and trigger a matching
        track recommendation. Current playlist mood: {currentMood}.
      </p>

      <div className="face-card__stage">
        <div className="face-card__frame">
          <video
            ref={videoRef}
            className="face-card__video"
            playsInline
            muted
          />
          <div className="face-card__reticle" />
          <div className="face-card__live-chip">
            <span className="face-card__live-dot" />
            Live input
          </div>
        </div>

        <div className="face-card__panel">
          <div className="face-card__reading">
            <span className="face-card__label">Detected expression</span>
            <div className="face-card__expression-row">
              <strong className="face-card__expression">{expression}</strong>
              <p className="face-card__note">{cameraStatus}</p>
            </div>
          </div>

          <div className="face-card__tips">
            {scanningTips.map((tip) => (
              <span className="face-card__tip" key={tip}>
                {tip}
              </span>
            ))}
          </div>

          <button
            className="button button--full"
            type="button"
            onClick={handleClick}
            disabled={!cameraReady || loading || isDetecting}
          >
            {loading
              ? "Finding track..."
              : isDetecting
                ? "Reading expression..."
                : "Detect expression"}
          </button>
        </div>
      </div>
    </section>
  );
}
