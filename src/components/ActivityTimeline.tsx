import type { ActivityEvent } from "../lib/types";

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toISOString().replace("T", " ").replace(".000Z", " UTC");
}

export default function ActivityTimeline({ events }: { events: readonly ActivityEvent[] }) {
  const chronologicalEvents = [...events].sort((left, right) =>
    left.occurredAt.localeCompare(right.occurredAt),
  );

  if (chronologicalEvents.length === 0) {
    return <p className="profile-muted">No activity recorded.</p>;
  }

  return (
    <ol className="activity-timeline" aria-label="Application activity">
      {chronologicalEvents.map((event) => (
        <li key={event.id}>
          <time dateTime={event.occurredAt}>{formatTimestamp(event.occurredAt)}</time>
          <div>
            <strong>{event.type}</strong>
            <p>{event.message}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
