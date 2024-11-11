import type { Metadata } from "next";
import "@/app/globals.css";
import NavBar from "@/components/NavBar"



export const metadata: Metadata = {
  title: "MysticTalk",
  description: "MtsticTalk is secrect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> 
      <body>
      <NavBar />
        {children}
      </body>
      
    </html>
  );
}
