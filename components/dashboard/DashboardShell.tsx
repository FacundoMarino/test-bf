import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function DashboardShell({
  children,
  showClubNav = false,
  showSuperAdminNav = false,
  preContent,
}: {
  children: React.ReactNode;
  showClubNav?: boolean;
  showSuperAdminNav?: boolean;
  preContent?: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <div className="flex min-h-screen w-full">
        <Sidebar
          showClubNav={showClubNav}
          showSuperAdminNav={showSuperAdminNav}
        />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col pt-14 md:pt-0">
          <Header />
          {preContent}
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
