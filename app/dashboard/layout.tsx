import { DashboardDock } from "@/components/dashboard-dock";

export const metadata = {
  title: "Dashboard",
  description: "Crabigator Stats — dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardDock />
      <div>{children}</div>;
    </>
  );
}
