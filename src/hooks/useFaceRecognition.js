import { useState, useCallback } from 'react';

export const useFaceRecognition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);

  const startCamera = useCallback(async (videoRef) => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      setError(`Camera access denied: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const stopCamera = useCallback((videoRef) => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  }, []);

  return {
    loading,
    error,
    faceDetected,
    setFaceDetected,
    startCamera,
    stopCamera
  };
};

export default useFaceRecognition;
