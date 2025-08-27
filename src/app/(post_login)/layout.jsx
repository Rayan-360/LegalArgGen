import {Mona_Sans } from "next/font/google";
import { ThemeProvider } from "@/lib/ThemeContext";
import "../globals.css";
import { AuthProvider } from "@/lib/AuthContext";

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
        <AuthProvider>
          <main>
                {children}
          </main>
        </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
