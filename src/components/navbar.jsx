"use client";
import ThemeButton from "./toggle";
import NavLink from "./navlink";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "@/lib/ThemeContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10); // trigger when scrolled a little
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const { theme, toggleTheme } = useTheme();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`w-full fixed top-0 left-0 z-50 dark:text-white transition-colors duration-300 ease-out ${
          scrolled ? "bg-white dark:bg-[#161618]" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold cursor-pointer ml-2">
            <Link
              href="/"
              className="flex gap-2 items-center justify-center text-black dark:text-white"
            >
              <Image
                src={`${
                  theme === "dark"
                    ? "/scales_logo_light.svg"
                    : "/scales_logo_dark.svg"
                }`}
                width={45}
                height={45}
                alt="main_logo"
              />
              <span>LegalArgGen</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
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

          {/* Desktop Auth Buttons */}
          <div className="flex flex-row space-x-6 items-center justify-center">
            <div className="block lg:hidden">
              <ThemeButton />
            </div>
            <i
              className="ri-menu-line lg:hidden flex cursor-pointer text-2xl"
              onClick={toggleMobileMenu}
            ></i>

            <Link
              href="/login"
              className="font-semibold hidden lg:block text-nowrap"
            >
              Sign in
            </Link>
            <button className="hidden lg:block dark:bg-[#161618] bg-black hover:bg-[#161618] text-white px-6 py-3 rounded-full dark:hover:bg-black cursor-pointer transition dark:border-1 dark:border-white">
              <Link href="/signup">Get Started</Link>
            </button>
            <div className="hidden lg:block">
              <ThemeButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Menu Sidebar */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-[#161618] z-50 shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-lg font-semibold text-black dark:text-white">
              Menu
            </span>
            <i
              className="ri-close-line text-2xl cursor-pointer text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition"
              onClick={closeMobileMenu}
            ></i>
          </div>

          {/* Mobile Navigation Links */}
          <ul className="flex flex-col space-y-1 p-4 flex-grow">
            <li>
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#242628] transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#242628] transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/features"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#242628] transition-colors duration-200"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#242628] transition-colors duration-200"
              >
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Mobile Auth Buttons */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="block w-full text-center px-4 py-3 rounded-lg font-semibold text-black dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#242628] transition-colors duration-200"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={closeMobileMenu}
              className="block w-full text-center px-4 py-3 rounded-lg font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
