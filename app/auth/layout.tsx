import React from "react";
import "../globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Golden Hills - Authentification",
  description: "Managemnt Web Application Authentification",
};

export default function AuthLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <main className="h-dvh">
          {children}
        </main>
      </body>
    </html>
  );
}
