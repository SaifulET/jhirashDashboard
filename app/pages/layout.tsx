import DashboardLayout from "@/Components/Sidebar/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      {/* Remove the grid container and handle layout within DashboardLayout */}
      <DashboardLayout>
        <div >
          {children}
        </div>
      </DashboardLayout>
    </div>
  );
}