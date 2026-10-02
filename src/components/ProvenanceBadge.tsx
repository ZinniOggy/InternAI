import type { DraftLabel, FactSource } from "../lib/types";

export default function ProvenanceBadge({ source }: { source: FactSource | DraftLabel }) {
  return <span className="provenance-badge">{source}</span>;
}
