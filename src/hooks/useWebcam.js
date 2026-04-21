import { useEffect, useRef, useState } from "react";

export function useWebcam(enabled) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    let currentStream = null;

    async function start() {
      try {
        setError(null);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Your browser does not support media devices. Please use a modern browser.");
        }
        
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        
        currentStream = s;
        setStream(s);
        
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Camera Setup Error:", err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError("Camera and microphone permission denied. Please allow them in your browser settings.");
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError("No camera or microphone found.");
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError("Your camera/mic is already in use by another application.");
        } else {
           setError(err.message || "Could not access camera/microphone");
        }
      }
    }

    if (enabled) {
      start();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [enabled]);

  return { videoRef, error, stream };
}
