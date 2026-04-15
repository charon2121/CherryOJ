import MainAppShell from "@/components/oj/MainAppShell";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainAppShell>{children}</MainAppShell>;
}
