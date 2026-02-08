import type { Metadata } from "next";
import {  Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // include the weights you use
  variable: "--font-poppins", // optional: CSS variable name
});
export const metadata: Metadata = {
  title: "Jhirash Dashboard",
  description: "Admin dashboard for Jhirash, a ride-hailing service. Manage drivers, view analytics, and oversee operations with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"className={poppins.variable}>
      <body
       
      >
        
        {children}
      </body>
    </html>
  );
}
