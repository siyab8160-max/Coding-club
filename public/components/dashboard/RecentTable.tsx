import { formatDateTime } from "@/lib/utils";
import type { Registration } from "@/types";

interface RecentTableProps {
  registrations: Registration[];
  eventTitles?: Record<string, string>;
}

export function RecentTable({
  registrations,
  eventTitles = {},
}: RecentTableProps) {
  if (registrations.length === 0) {
    return (
      <p className="text-text-muted text-sm py-8 text-center">
        No registrations yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-text-muted border-b border-white/10">
            <th className="pb-3 pr-4 font-medium">Name</th>
            <th className="pb-3 pr-4 font-medium">Event</th>
            <th className="pb-3 pr-4 font-medium">College</th>
            <th className="pb-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr
              key={reg.id}
              className="border-b border-white/5 hover:bg-white/5"
            >
              <td className="py-3 pr-4">{reg.participantName}</td>
              <td className="py-3 pr-4 text-text-muted">
                {eventTitles[reg.eventId] || reg.eventId.slice(0, 8)}
              </td>
              <td className="py-3 pr-4 text-text-muted">{reg.college}</td>
              <td className="py-3 text-text-muted">
                {reg.timestamp ? formatDateTime(reg.timestamp) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
