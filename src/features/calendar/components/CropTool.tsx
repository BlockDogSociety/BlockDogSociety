"use client";

import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const DPI = 300;
const INCHES = [8.5, 11] as const;

function centeredAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

async function exportCrop(
  image: HTMLImageElement,
  crop: PixelCrop,
  outputWidth: number,
  outputHeight: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported in this browser.");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to export image."))),
      "image/jpeg",
      0.95,
    );
  });
}

export function CropTool({ photoUrl, dogName }: { photoUrl: string; dogName: string }) {
  const [portrait, setPortrait] = useState(true);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const aspect = portrait ? INCHES[0] / INCHES[1] : INCHES[1] / INCHES[0];
  const outputWidth = Math.round((portrait ? INCHES[0] : INCHES[1]) * DPI);
  const outputHeight = Math.round((portrait ? INCHES[1] : INCHES[0]) * DPI);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centeredAspectCrop(width, height, aspect));
  }

  async function handleDownload() {
    if (!imgRef.current || !completedCrop) return;
    const blob = await exportCrop(imgRef.current, completedCrop, outputWidth, outputHeight);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${dogName.replace(/\s+/g, "-").toLowerCase()}-8.5x11.jpg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setPortrait((p) => !p);
            if (imgRef.current) {
              setCrop(
                centeredAspectCrop(
                  imgRef.current.width,
                  imgRef.current.height,
                  portrait ? INCHES[1] / INCHES[0] : INCHES[0] / INCHES[1],
                ),
              );
            }
          }}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          Switch to {portrait ? "landscape" : "portrait"}
        </button>
        <span className="text-sm text-gray-500">
          Output: {outputWidth}×{outputHeight}px (8.5×11in @ 300 DPI)
        </span>
      </div>

      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={aspect}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- react-image-crop needs a plain, ref-accessible <img>, not next/image's wrapper */}
        <img
          ref={imgRef}
          src={photoUrl}
          alt={dogName}
          crossOrigin="anonymous"
          onLoad={onImageLoad}
          className="max-h-[70vh]"
        />
      </ReactCrop>

      <button
        type="button"
        onClick={handleDownload}
        disabled={!completedCrop}
        className="self-start rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        Download cropped photo
      </button>
    </div>
  );
}
