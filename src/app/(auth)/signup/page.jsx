"use client";
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/lib/ThemeContext";

export default function SignUp(){

    const{theme} = useTheme();
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-[#161618] dark:text-white">
            <div className="p-10 mx-auto rounded-lg shadow-lg bg-white dark:bg-[#242628] w-96 md:w-[450px]">
                <div className="w-full flex items-center justify-center mb-2">
                    <Image src={`${theme === 'dark' ? "/scales_logo_light.svg":"/scales_logo_dark.svg"}`} width={100} height={100} alt="main_logo"/>
                </div>
                <h2 className="dark:text-white text-black font-semibold text-3xl text-center">Get Started</h2>
                <form action="" className="mt-4 space-y-4">
                    <p className="dark:text-slate-400 text-slate-600 text-center text-[14px]">Already have an Account? <span className="font-semibold text-slate-800 dark:text-white"><Link href="/login">Login</Link></span></p>
                    <div className="input-box relative space-x-2">
                        <i className="ri-user-3-line absolute left-3 text-gray-500"></i>
                        <input type="text" placeholder="Full name" id="name"/>
                    </div>
                    <div className="input-box relative space-x-2">
                        <i class="ri-mail-line absolute left-3 text-gray-500"></i>
                        <input type="text" placeholder="email address" id="email"/>
                    </div>
                    <div className="input-box relative space-x-2">
                        <i className="ri-lock-line absolute left-3 text-gray-500"></i>
                        <input type="password" placeholder="Password" id="pass"/>
                    </div>
                    <div className="input-box relative space-x-2">
                        <i className="ri-lock-line absolute left-3 text-gray-500"></i>
                        <input type="password" placeholder="Confirm Password" id="cpass"/>
                    </div>
                    <button className="bg-[#0072DB] hover:bg-blue-500 transition ease-in-out duration-300 text-sm font-semibold text-white px-3 py-2 rounded-md w-full ">Sign Up</button>
                </form>
                <div className="flex items-center my-4 gap-2">
                    <hr className="flex-grow border-gray-300 border-t"/>
                    <span className="text-sm text-gray-500">OR</span>
                    <hr className="flex-grow border-gray-300 border-t"/>
                </div>
                <button className="flex items-center justify-center gap-2 px-3 py-2 text-black text-sm dark:text-white shadow-sm w-full dark:bg-[#202224] dark:hover:bg-[hsl(210,10%,13%)] rounded-md border-1 border-slate-400 hover:bg-slate-50 transition ease-in-out duration-300 text-nowrap font-semibold"><Image width={15} height={15} alt="glogo" src="/google-icon-logo.svg"/><span>Continue with Google</span> </button>

            </div>
        </div>
    )
}