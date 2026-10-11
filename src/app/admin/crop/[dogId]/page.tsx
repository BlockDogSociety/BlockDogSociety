import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { getDogById } from "@/features/dogs/queries";
import { CropTool } from "@/features/calendar/components/CropTool";
import { CalendarCropTool } from "@/features/calendar/components/CalendarCropTool";

export default async function CropPage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  await requireAdmin();
  const { dogId } = await params;
  const dog = await getDogById(dogId);

  if (!dog) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Crop: {dog.name}</h1>

      <section className="mb-10">
        <h2 className="mb-3 font-medium">Calendar page photo</h2>
        <CalendarCropTool
          dogId={dog.id}
          photoUrl={dog.photoUrl}
          dogName={dog.name}
          hasExistingCrop={dog.hasCalendarCrop}
        />
      </section>

      <section className="border-t pt-8">
        <h2 className="mb-3 font-medium">Print file (8.5×11)</h2>
        <CropTool photoUrl={dog.photoUrl} dogName={dog.name} />
      </section>
    </main>
  );
}
