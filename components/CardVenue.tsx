type Props = { name?: string; location?: string };

export default function CardVenue({ name = 'Venue', location = 'City' }: Props) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="font-medium">{name}</div>
      <div className="text-sm text-muted-foreground">{location}</div>
    </div>
  );
}
