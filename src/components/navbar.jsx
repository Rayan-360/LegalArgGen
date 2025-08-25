"use client";
import ThemeButton from "./toggle";
import NavLink from "./navlink";
import Link from "next/link";
import { useState,useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/lib/ThemeContext";
export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10); // trigger when scrolled a little
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {theme,toggleTheme} = useTheme();

  return (
    <nav       className={`w-full fixed top-0 left-0 z-50 dark:text-white transition-colors duration-300 ease-out ${
        scrolled ? "bg-white dark:bg-[#161618]" : "bg-transparent"
      }`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer ml-2">
              <Link
      href="/"
      className="flex gap-2 items-center justify-center text-black dark:text-white"
    >
      <Image src={`${theme === 'dark' ? "/scales_logo_light.svg":"/scales_logo_dark.svg"}`} width={45} height={45} alt="main_logo"/>
      <span>LegalArgGen</span>
    </Link>
        </div>

        <div>
          <ul className="lg:flex space-x-6 hidden">
            <li>
              <NavLink href="/" label="Home" />
            </li>
            <li>
              <NavLink href="/about" label="About" />
            </li>
            <li>
              <NavLink href="/features" label="Features" />
            </li>
            <li>
              <NavLink href="/contact" label="Contact Us" />
            </li>
          </ul>
        </div>

        <div className="flex flex-row space-x-6 items-center justify-center">
            <Link href="/login" className="font-semibold hidden md:block text-nowrap">Sign in</Link>
            <i className="ri-menu-line md:hidden flex cursor-pointer"></i>
            <button className="hidden md:block dark:bg-[#161618] bg-black hover:bg-[#161618] text-white px-6 py-3 rounded-full dark:hover:bg-black cursor-pointer transition dark:border-1 dark:border-white">
              Get Started
            </button>
            <div className="hidden md:block"><ThemeButton/></div>
        </div>
      </div>
    </nav>
  );
}
