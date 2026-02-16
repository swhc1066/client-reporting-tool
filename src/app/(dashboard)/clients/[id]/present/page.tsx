import { PresentationView } from "@/components/presentation/presentation-view";

export default async function PresentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <PresentationView clientId={id} showSpeakerNotes />
    </div>
  );
}
