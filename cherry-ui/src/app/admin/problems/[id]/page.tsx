import AdminProblemEditorShell from "@/components/admin/AdminProblemEditorShell";
import { getAdminProblem } from "@/lib/api/endpoints/admin-problems";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

async function loadAdminProblem(id: string) {
  try {
    return await getAdminProblem(id);
  } catch {
    return null;
  }
}

export default async function AdminProblemEditPage({ params }: Props) {
  const { id } = await params;
  const problem = await loadAdminProblem(id);
  if (!problem) {
    notFound();
  }
  return <AdminProblemEditorShell mode="edit" problem={problem} />;
}
