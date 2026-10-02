import type { FactSource } from "../lib/types";

export default function ProvenanceBadge({ source }: { source: FactSource }) {
  return <span className="provenance-badge">{source}</span>;
}
