"use client"; // Ensures this is treated as a client component

import { useRef, useEffect } from "react";
//import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import * as mpSelfieSegmentation from "@mediapipe/selfie_segmentation";
import { Camera } from "@mediapipe/camera_utils";

export default function CameraBackgroundRemover() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const selfieSegmentation = new mpSelfieSegmentation.SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });
    selfieSegmentation.setOptions({
      modelSelection: 1,
    });
    selfieSegmentation.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = results.image.width;
      canvas.height = results.image.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "source-in";
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await selfieSegmentation.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }}></video>
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }}></canvas>
    </div>
  );
}

//console.log(mpSelfieSegmentation);
