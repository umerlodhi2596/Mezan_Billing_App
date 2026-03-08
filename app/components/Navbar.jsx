"use client"
import { Menu } from 'lucide-react'
import { useSidebar } from '../(dashboard)/context/SidebarProvider'
import { signOut, useSession } from "next-auth/react";
import { useState } from 'react';

export default function Navbar() {

    const session = useSession();

    let [logoutLoading, setLogoutLoading] = useState(false);

    const {setOpen} = useSidebar();

    const handleLogout = () => {
        setLogoutLoading(true);
        signOut();
        setLogoutLoading(false);
    }

  return (
    <>
        <div className='w-full bg-gray-900 flex items-center justify-between px-10 py-4'>
            <Menu size={25} color='white' onClick={() => setOpen(true)}/>
            <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-gray-950 rounded-full text-blue-500 flex items-center justify-center text-2xl font-bold'>{session?.data?.user?.username.charAt(0).toUpperCase()}</div>
                <h4 className='text-lg text-white font-light'>{session?.data?.user?.username}</h4>
                <button disabled={logoutLoading} onClick={handleLogout} className='text-white bg-blue-500 px-5 py-3 ml-5 rounded-xl text-md font-medium cursor-pointer hover:bg-blue-600'>
                    {logoutLoading ? <div className="w-5 h-5 border-2 border-white border-dashed rounded-full animate-spin"></div>: "Logout"}
                </button>
            </div>
        </div>
    </>
  )
}
