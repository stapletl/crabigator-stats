import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardDock } from "@/components/dashboard-dock";

export const metadata: Metadata = {
  title: "Crabigator Stats - WaniKani Statistics Dashboard",
  description: "A comprehensive statistics dashboard for WaniKani users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <DashboardDock />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
