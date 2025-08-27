import {Mona_Sans } from "next/font/google";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/lib/ThemeContext";
import Footer from "@/components/footer";
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
        <header>
            <Navbar/>
        </header>
        <main>
              {children}
        </main>
        <footer>
          <Footer/>
        </footer>
        </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
