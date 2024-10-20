import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { VerifitLandingWhite } from "@/components/verifit-landing-white";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Verifit",
  description: "Prove your progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Accountability for your fitness journey."
        />
        <title>Verifit</title>
        <link rel="icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <VerifitLandingWhite />
        </Providers>
      </body>
    </html>
  );
}
