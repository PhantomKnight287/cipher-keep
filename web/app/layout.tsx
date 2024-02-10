import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { FontMono, FontSans, fontHeading } from "@/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Hydrate from "@/components/user/hydrate";

export const metadata = {
  title: {
    default: "CipherKeep",
    template: "%s - CipherKeep",
  },
  metadataBase: new URL("https://cipherkeep.vercel.app"),
  description:
    "Your trusted vault for secure data storage. Safeguard your sensitive information with cutting-edge encryption technology.",
  openGraph: {
    title: "CipherKeep",
    description:
      "Your trusted vault for secure data storage. Safeguard your sensitive information with cutting-edge encryption technology.",
    images: ["/icon.png"],
    locale: "en_US",
    url: "https://cipherkeep.vercel.app/home",
    type: "website",
  },
  authors: [
    {
      name: "PhantomKnight287",
      url: "https://procrastinator.fyi",
    },
  ],
  creator: "PhantomKnight287",
  twitter: {
    title: "Cipherkeep",
    description:
      "Your trusted vault for secure data storage. Safeguard your sensitive information with cutting-edge encryption technology.",
    card: "summary",
    images: ["/icon.png"],
  },
  generator: "Next.js",
} satisfies Metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          FontSans.variable,
          FontMono.variable,
          fontHeading.variable,
          "font-sans"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
          <Hydrate />
          <Sonner />
        </ThemeProvider>
      </body>
    </html>
  );
}
