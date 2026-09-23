import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LightningField from "@/components/LightningField";

export const metadata: Metadata = {
  title: "THE AKUNU BOYS SCHOOL — THE STANDARD",
  description:
    "THE AKUNU BOYS SCHOOL — 24 hours online. We were born for greatness.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-noise min-h-screen antialiased" style={{ fontFamily: "Inter, sans-serif" }}>
        <LightningField />
        <Nav />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
