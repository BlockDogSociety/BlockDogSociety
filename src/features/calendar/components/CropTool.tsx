"use client";

import { useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { centeredAspectCrop, exportCrop } from "@/features/calendar/crop-utils";

const DPI = 300;
const INCHES = [8.5, 11] as const;

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
