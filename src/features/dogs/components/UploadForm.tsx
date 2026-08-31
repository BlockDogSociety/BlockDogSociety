"use client";

import { startTransition, useActionState, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createDog, type CreateDogState } from "@/features/dogs/actions";

const initialState: CreateDogState = { error: null };

export function UploadForm() {
  const [state, formAction, pending] = useActionState(createDog, initialState);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setUploadError(null);

    const name = formData.get("name") as string;
    const photo = formData.get("photo") as File;

    if (!photo || photo.size === 0) {
      setUploadError("Please choose a photo.");
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
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from("dog-photos").upload(path, photo);
    setUploading(false);

    if (error) {
      setUploadError(error.message);
      return;
    }

    const dogFormData = new FormData();
    dogFormData.set("name", name);
    dogFormData.set("photoPath", path);
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
        <label htmlFor="photo" className="text-sm font-medium">
          Photo
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          required
          className="rounded-md border px-3 py-2"
        />
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
