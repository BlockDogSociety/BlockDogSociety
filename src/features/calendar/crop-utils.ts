import { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop";

/** The calendar page shows photos in a 3:2 landscape frame. */
export const CALENDAR_ASPECT = 3 / 2;
export const CALENDAR_OUTPUT_WIDTH = 1800;
export const CALENDAR_OUTPUT_HEIGHT = Math.round(CALENDAR_OUTPUT_WIDTH / CALENDAR_ASPECT);

export function centeredAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

// Browsers cap how large a source image drawImage can handle (Safari stops
// around 16.7M pixels). Past that it draws nothing and the export silently
// comes out solid black, so check rather than save a blank file.
function assertNotBlank(ctx: CanvasRenderingContext2D, width: number, height: number) {
  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, width, height).data;
  } catch {
    return; // cross-origin taint: can't inspect, let the export through
  }
  const step = Math.max(4, Math.floor(data.length / 4 / 400) * 4);
  for (let i = 0; i < data.length; i += step) {
    if (data[i] !== 0 || data[i + 1] !== 0 || data[i + 2] !== 0 || data[i + 3] !== 0) {
      return;
    }
  }
  throw new Error(
    "This photo is too large for your browser to crop — the result came out blank. Try again in Chrome, or on a desktop computer.",
  );
}

export async function exportCrop(
  image: HTMLImageElement,
  crop: PixelCrop,
  outputWidth: number,
  outputHeight: number,
  quality = 0.95,
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

  assertNotBlank(ctx, outputWidth, outputHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to export image."))),
      "image/jpeg",
      quality,
    );
  });
}
