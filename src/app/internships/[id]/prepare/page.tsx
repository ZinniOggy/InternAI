import { notFound } from "next/navigation";
import PrepareReviewClient from "../../../../components/PrepareReviewClient";
import { studentProfile } from "../../../../data/student";
import { generateApplicationDraft } from "../../../../lib/generator";
import { getInternshipById } from "../../../../services/mock-internship-service";

export default async function PrepareReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const internship = getInternshipById(id);

  if (!internship) notFound();

  const draft = generateApplicationDraft(studentProfile, internship);
  return <PrepareReviewClient internshipId={internship.id} draft={draft} />;
}
