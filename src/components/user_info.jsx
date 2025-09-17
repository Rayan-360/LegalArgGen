import { useTheme } from "@/lib/ThemeContext"
import { Logout } from "@/actions/auth";
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";

const UserProfile = () => {

  const {toggleTheme} = useTheme();

  const handleMode = () => {
    toggleTheme();
  }
  const handleLogout = () => {
      Logout();
  }

  const {user} = useAuth();
  

  return (
    <div className='min-w-[300px] w-auto dark:bg-[#3E3F42] bg-[#FCFCFC] flex p-2 rounded-lg items-start justify-center flex-col text-black dark:text-white border-1 border-gray-200 dark:border-none'>
        <div className="flex items-center justify-start gap-2  cursor-pointer dark:hover:bg-[#4A4A4A] hover:bg-[#F2F2F2]  w-full p-2 rounded-lg">
          {user && (
              <div className="flex gap-2">
                <div className="w-10 h-10 overflow-hidden rounded-full cursor-pointer" onClick={() => setOpen(!open)}>
                    <Image src={user.user_metadata?.avatar_url || "/user.png"} alt="avatar" width={30} height={30} className="object-cover w-full h-full"/>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold">{user.user_metadata?.full_name}</p>
                  <p className="text-sm truncate max-w-[180px]">{user.email}</p>
                </div>
              </div>  
          )}
        </div>
        <div className="flex items-center justify-start gap-2 cursor-pointer dark:hover:bg-[#4A4A4A] hover:bg-[#F2F2F2] w-full p-2 rounded-lg" onClick={handleMode}>
            <i className="ri-sun-line"></i>
            <p>Toggle theme</p>
        </div>
        <div className="flex items-center justify-start gap-2 cursor-pointer dark:hover:bg-[#4A4A4A] hover:bg-[#F2F2F2] w-full p-2 rounded-lg" onClick={handleLogout}>
            <i class="ri-logout-box-line"></i>
            <p>Logout</p>
        </div>
    </div>
  )
}

export default UserProfile