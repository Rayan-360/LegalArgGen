import {Mona_Sans } from "next/font/google";
import { ThemeProvider } from "@/lib/ThemeContext";
import "../globals.css";

const mona = Mona_Sans({
  subsets:["latin"],
})

export const metadata = {
  title: "Legal Arg Gen",
  description: "Legal arguement generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${mona.className} `}
      >
      <ThemeProvider>
        <main>
              {children}
        </main>
      </ThemeProvider>
      </body>
    </html>
  );
}
