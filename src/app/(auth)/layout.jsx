import {Mona_Sans } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/AuthContext";
const mona = Mona_Sans({
  subsets:["latin"],
})

export const metadata = {
  title: "Legal Arg Gen",
  description: "Legal arguement generator",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${mona.className} `}
      >
      <ThemeProvider>
        <AuthProvider>
        <main>
              {children}
              <Toaster position="top-center"/>
        </main>
        </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
