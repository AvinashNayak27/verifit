import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/lib/providers";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex items-center justify-center min-h-screen">
            <div className="hidden md:block text-center p-4">
            <h1 className="text-2xl font-bold mb-4">Desktop Version Not Available</h1>
            <p className="text-lg">
              Please use a mobile device for the best experience. The desktop version is not ready yet on all routes.
            </p>
          </div>
          <div className="md:hidden w-full">
            {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
