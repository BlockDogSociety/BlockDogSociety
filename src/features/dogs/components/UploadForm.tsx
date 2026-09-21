"use client";

import { startTransition, useActionState, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createDog, type CreateDogState } from "@/features/dogs/actions";
import {
  resizeImage,
  THUMB_MAX_EDGE,
  DISPLAY_MAX_EDGE,
  IMMUTABLE_CACHE_SECONDS,
} from "@/features/dogs/resize";

const initialState: CreateDogState = { error: null };

const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export function UploadForm() {
  const [state, formAction, pending] = useActionState(createDog, initialState);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setUploadError(null);

    const name = formData.get("name") as string;
    const story = formData.get("story") as string;
    const photo = formData.get("photo") as File;

    if (!photo || photo.size === 0) {
      setUploadError("Please choose a photo.");
      return;
    }

    if (!ALLOWED_TYPES.includes(photo.type)) {
      setUploadError("Photos must be a JPEG or PNG file.");
      return;
    }

    if (photo.size > MAX_FILE_BYTES) {
      setUploadError("Photos must be 10MB or smaller.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploadError("You must be signed in.");
      setUploading(false);
      return;
    }

    const extension = photo.name.split(".").pop() ?? "jpg";
    const base = `${user.id}/${crypto.randomUUID()}`;
    const path = `${base}.${extension}`;
    const thumbPath = `${base}-thumb.jpg`;
    const displayPath = `${base}-display.jpg`;

    let thumb: Blob, display: Blob;
    try {
      [thumb, display] = await Promise.all([
        resizeImage(photo, THUMB_MAX_EDGE),
        resizeImage(photo, DISPLAY_MAX_EDGE),
      ]);
    } catch {
      setUploadError("We couldn't read that image. Try a different photo.");
      setUploading(false);
      return;
    }

    const bucket = supabase.storage.from("dog-photos");
    const opts = { cacheControl: IMMUTABLE_CACHE_SECONDS };
    const results = await Promise.all([
      bucket.upload(path, photo, opts),
      bucket.upload(thumbPath, thumb, { ...opts, contentType: "image/jpeg" }),
      bucket.upload(displayPath, display, { ...opts, contentType: "image/jpeg" }),
    ]);
    setUploading(false);

    const failed = results.find((r) => r.error);
    if (failed?.error) {
      setUploadError(failed.error.message);
      return;
    }

    const dogFormData = new FormData();
    dogFormData.set("name", name);
    dogFormData.set("story", story);
    dogFormData.set("photoPath", path);
    dogFormData.set("thumbPath", thumbPath);
    dogFormData.set("displayPath", displayPath);
    startTransition(() => {
      formAction(dogFormData);
    });
  }

  const busy = uploading || pending;

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Dog&apos;s name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="rounded-md border px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="story" className="text-sm font-medium">
          Tell us about your dog (optional)
        </label>
        <textarea
          id="story"
          name="story"
          rows={4}
          maxLength={500}
          placeholder="A brief description of your dog, plus the craziest short story about your dog on the block."
          className="rounded-md border px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="photo" className="text-sm font-medium">
          Photo
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png"
          required
          className="rounded-md border px-3 py-2"
        />
        <p className="text-xs text-gray-500">
          JPEG or PNG, up to 10MB. Use a landscape (horizontal) photo that is
          sharp and high resolution (300 DPI or higher).
        </p>
      </div>

      {(uploadError || state.error) && (
        <p className="text-sm text-red-600">{uploadError ?? state.error}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {uploading ? "Uploading photo..." : pending ? "Saving..." : "Upload"}
      </button>
    </form>
  );
}
