import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Joshua D. Abad | Data Engineer",
  description: "Portfolio of Joshua D. Abad — Data Engineer specializing in ETL, Data Pipelines, Cloud, and SQL. Building scalable data solutions that turn data into impact.",
  keywords: ["Data Engineer", "ETL", "Data Pipelines", "Azure", "AWS", "BigQuery", "SQL", "Python"],
  authors: [{ name: "Joshua D. Abad" }],
  openGraph: {
    title: "Joshua D. Abad | Data Engineer",
    description: "Building scalable data solutions that turn data into impact.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      {/* Prevent flash: read localStorage before first paint */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}` }} />
      </head>
      <body suppressHydrationWarning className={`${inter.className} min-h-full antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
