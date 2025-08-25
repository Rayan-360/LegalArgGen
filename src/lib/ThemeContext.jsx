'use client';

import { createContext,useContext,useState,useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({children}){
    const [theme,setTheme] = useState(null);
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        if(savedTheme === 'dark'){
            document.documentElement.classList.add('dark');
        }
        else{
            document.documentElement.classList.remove('dark');
        }
        // console.log("ThemeProvider mounted");
    },[]);

    const toggleTheme = () => {
        const newTheme = theme === 'light'?'dark':'light';
        setTheme(newTheme);
        localStorage.setItem('theme',newTheme);
        if(newTheme === 'dark'){
            document.documentElement.classList.add('dark');
        }
        else{
            document.documentElement.classList.remove('dark');
        }
    }
    if (theme === null) return null;
    return (
        <ThemeContext.Provider value={{theme,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme(){
    return useContext(ThemeContext);
}

