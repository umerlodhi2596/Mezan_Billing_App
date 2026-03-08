import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const outFit = Outfit({
  subsets: ["latin"],
  weight: ["200","300","400","500","600","700"]
});

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={`${outFit.className} antialiased`}>
        <Toaster/>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}