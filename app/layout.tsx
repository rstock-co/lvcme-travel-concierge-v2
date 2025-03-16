import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TravelStateProvider } from "@/hooks/use-travel-state";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Travel Concierge",
  description: "AI-powered travel assistant for LVCME",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TravelStateProvider>
            {children}
            <Toaster />
          </TravelStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
