import {Mona_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/lib/ThemeContext";

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
        <header>
            <Navbar/>
        </header>
        <main>
              {children}
        </main>
        <footer>

        </footer>
      </ThemeProvider>
      </body>
    </html>
  );
}
