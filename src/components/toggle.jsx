"use client"

import { useTheme } from "@/lib/ThemeContext";
import { useState } from "react";

export default function ThemeButton() {
    const { theme, toggleTheme } = useTheme();
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        setIsAnimating(true);
        toggleTheme();
        setTimeout(() => setIsAnimating(false), 200); // matches animation duration
    };

    return (
        <button 
            onClick={handleClick} 
            className="text-2xl dark:text-white transition-colors ease-in-out duration-300"
        >
            <span 
                className={`inline-block transition-transform duration-200 ${isAnimating ? "rotate-180 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
            >
                {theme === 'light' 
                    ? <i className="ri-sun-line"></i> 
                    : <i className="ri-moon-fill"></i>}
            </span>
        </button>
    );
}
