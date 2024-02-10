export { GeistSans as FontSans } from "geist/font/sans";
export { GeistMono as FontMono } from "geist/font/mono";
import localFont from "next/font/local";

export const fontHeading = localFont({
  src: "../public/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});
