type Props = { params: { id: string } };

export default function OwnerFacilityEditPage({ params }: Props) {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Edit Facility {params.id}</h1>
    </main>
  );
}
