import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roster Viewer - Tim Tambang",
  description: "Dashboard roster bulanan tim tambang",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gradient-vibrant min-h-screen text-white">
        {children}
      </body>
    </html>
  );
}
