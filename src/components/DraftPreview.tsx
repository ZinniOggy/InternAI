import type { DraftBlock } from "../lib/types";
import ProvenanceBadge from "./ProvenanceBadge";

export default function DraftPreview({
  title,
  blocks,
}: {
  title: string;
  blocks: readonly DraftBlock[];
}) {
  return (
    <section className="draft-preview" aria-label={title}>
      <h2>{title}</h2>
      <div className="draft-block-list">
        {blocks.map((block) => (
          <article className="draft-block" key={block.id}>
            <div className="draft-block-label">
              <ProvenanceBadge source={block.label} />
            </div>
            <p>{block.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
