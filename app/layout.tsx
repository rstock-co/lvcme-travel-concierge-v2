import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ChatStateProvider } from "@/hooks/use-chat-state";
import { TravelStateProvider } from "@/hooks/use-travel-state";

export const metadata: Metadata = {
  title: "Las Vegas Travel Concierge",
  description: "Plan your perfect Las Vegas trip with our AI-powered travel concierge",
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
            <ChatStateProvider>
              {children}
            </ChatStateProvider>
          </TravelStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
