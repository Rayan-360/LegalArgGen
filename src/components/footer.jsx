import Link from "next/link"
export default function Footer(){
    return(
        <footer className="w-full mx-auto py-6 px-6 bg-[#161618]">
            <div className="flex flex-col">
                <div className="w-full flex flex-col md:flex-row gap-4 justify-between px-4 md:px-16 text-white">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl  font-semibold">LegalArgGen</h2>
                        <p>Your AI-driven partner for precise legal reasoning From facts<br/>
                             to airtight arguments, crafted in the IRAC format instantly.
                        </p>
                        <div className="flex gap-3">
                            <i className="ri-github-fill text-4xl"></i>
                            <i className="ri-linkedin-box-fill text-4xl"></i>
                        </div>
                    </div>
                    <nav>
                        <p className="text-lg text-white underline mb-2">Site Map</p>
                        <ul className="flex flex-col gap-2 text-white">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/features">Features</Link></li>
                            <li><Link href="/contact">Contact us</Link></li>
                        </ul>
                    </nav>
                </div>
                <p className="text-center text-white mt-6">
                    Copyright © {new Date().getFullYear()} - All right reserved by LegalArgGen
                </p>
            </div>
        </footer>
    )
}