"use client"
import { useTheme } from "@/lib/ThemeContext";
import Image from "next/image";

export default function LogoImg({width,height}){
    const {theme} = useTheme();
    return(
        <Image
            src={theme === "dark" ? "/scales_logo_light.svg" : "/scales_logo_dark.svg"}
            width={width}
            height={height}
            alt="main_logo"
        />
    )
}