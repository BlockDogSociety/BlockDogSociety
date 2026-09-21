export const THUMB_MAX_EDGE = 640;
export const DISPLAY_MAX_EDGE = 1600;

// Files are named with a UUID and never change, so browsers can keep them.
export const IMMUTABLE_CACHE_SECONDS = "31536000";

// Scales a photo so its longest edge is at most maxEdge and re-encodes it as
// JPEG. Decoding through an <img> makes the browser apply EXIF orientation,
// so phone photos don't come out sideways.
export async function resizeImage(file: File, maxEdge: number, quality = 0.82): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();

    const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);

    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))),
        "image/jpeg",
        quality,
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
