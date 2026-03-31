import type { Metadata } from "next";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/sidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Hotel Golden Hills",
  description: "Managemnt Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <main className="mt-4 w-10/12 mx-auto">{children}</main>
          <Toaster position="bottom-right" />
        </SidebarProvider>
      </body>
    </html>
  );
}
