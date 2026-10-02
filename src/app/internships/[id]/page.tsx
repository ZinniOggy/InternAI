import { notFound } from "next/navigation";
import InternshipDetailsClient from "../../../components/InternshipDetailsClient";
import { studentProfile } from "../../../data/student";
import { calculateFitScore } from "../../../lib/fit-score";
import { getInternshipById } from "../../../services/mock-internship-service";

export default async function InternshipDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const internship = getInternshipById(id);

  if (!internship) notFound();

  const evaluation = calculateFitScore(studentProfile, internship);
  return <InternshipDetailsClient internship={internship} evaluation={evaluation} />;
}
