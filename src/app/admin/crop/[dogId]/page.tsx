import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { getDogById } from "@/features/dogs/queries";
import { CropTool } from "@/features/calendar/components/CropTool";

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
      <CropTool photoUrl={dog.photoUrl} dogName={dog.name} />
    </main>
  );
}
