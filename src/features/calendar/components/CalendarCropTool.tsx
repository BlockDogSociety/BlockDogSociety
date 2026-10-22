"use client";

import { useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { createClient } from "@/lib/supabase/client";
import { setCalendarCrop } from "@/features/calendar/actions";
import {
  CALENDAR_ASPECT,
  CALENDAR_OUTPUT_WIDTH,
  centeredAspectCrop,
  exportCrop,
} from "@/features/calendar/crop-utils";

export function CalendarCropTool({
  dogId,
  sourceUrl,
  dogName,
  hasExistingCrop,
}: {
  dogId: string;
  /** The ~1600px display copy, not the original: browsers fail to crop very
   *  large photos and silently produce a blank image. */
  sourceUrl: string;
  dogName: string;
  hasExistingCrop: boolean;
}) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centeredAspectCrop(width, height, CALENDAR_ASPECT));
  }

  async function handleSave() {
    if (!imgRef.current || !completedCrop) return;
    setError(null);
    setStatus("saving");

    try {
      // Never upscale: a portrait source has fewer than 1800px of width to give.
      const img = imgRef.current;
      const sourcePx = Math.round(completedCrop.width * (img.naturalWidth / img.width));
      const width = Math.min(CALENDAR_OUTPUT_WIDTH, Math.max(900, sourcePx));
      const height = Math.round(width / CALENDAR_ASPECT);
      const blob = await exportCrop(img, completedCrop, width, height, 0.9);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be signed in.");
      }

      // A fresh filename each time, so a year-long cache can't serve the old crop.
      const path = `${user.id}/${dogId}-calendar-${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("dog-photos")
        .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
      if (uploadError) {
        throw new Error(uploadError.message);
      }

      await setCalendarCrop(dogId, path);
      setStatus("saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the crop.");
      setStatus("idle");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        Drag to choose how this photo is framed on the calendar page.{" "}
        {hasExistingCrop ? "A crop is already saved — saving replaces it." : "No crop saved yet."}
      </p>

      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={CALENDAR_ASPECT}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- react-image-crop needs a plain, ref-accessible <img>, not next/image's wrapper */}
        <img
          ref={imgRef}
          src={sourceUrl}
          alt={dogName}
          crossOrigin="anonymous"
          onLoad={onImageLoad}
          className="max-h-[70vh]"
        />
      </ReactCrop>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!completedCrop || status === "saving"}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {status === "saving" ? "Saving..." : "Save for calendar page"}
        </button>
        {status === "saved" && (
          <span className="text-sm text-green-700">Saved — the calendar page now uses this.</span>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}
