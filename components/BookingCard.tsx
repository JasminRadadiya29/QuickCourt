type Props = { venue?: string; date?: string; status?: string };

export default function BookingCard({ venue = 'Venue', date = 'Date', status = 'pending' }: Props) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="font-medium">{venue}</div>
      <div className="text-sm text-muted-foreground">{date}</div>
      <div className="text-xs uppercase mt-2">{status}</div>
    </div>
  );
}
