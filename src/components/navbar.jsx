import ThemeButton from "./toggle";
import NavLink from "./navlink";
import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer"><Link href="/">LegalArgGen</Link></div>

        <ul className="flex space-x-6">
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
        <div className="flex flex-row space-x-6 items-center justify-center">
            <a href="" className="font-semibold">Sign in</a>
            <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-900 cursor-pointer transition dark:border-1 dark:border-white">
              Get Started
            </button>
            <ThemeButton/>
        </div>
      </div>
    </nav>
  );
}
