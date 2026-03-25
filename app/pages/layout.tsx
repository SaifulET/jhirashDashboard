import AuthGuard from "@/Components/auth/AuthGuard";
import DashboardLayout from "@/Components/Sidebar/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <AuthGuard>
        <DashboardLayout>
          <div>{children}</div>
        </DashboardLayout>
      </AuthGuard>
    </div>
  );
}
