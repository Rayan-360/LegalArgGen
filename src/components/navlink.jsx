"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function NavLink({href,label}){
    const pathname = usePathname();
    console.log(pathname);
    
    return (
        <Link href={href} className={`hover:text-black dark:hover:text-white transition ease-in-out duration-150 ${pathname === href ? "text-black font-semibold dark:text-white":"text-gray-700 dark:text-gray-400"}`}>{label}</Link>
    )
}