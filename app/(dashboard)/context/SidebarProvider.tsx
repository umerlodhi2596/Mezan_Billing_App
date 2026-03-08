"use client"
import { createContext, useContext, useState } from "react"

interface SidebarContextType {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export default function SidebarProvider({children}: {children: React.ReactNode}) {

    const [open, setOpen] = useState<boolean>(false);

  return (
    <>
        <SidebarContext.Provider value={{open, setOpen}}>
            {children}
        </SidebarContext.Provider>
    </>
  )
}

export function useSidebar() {
    const context = useContext(SidebarContext);

    if(!context) {
        throw new Error("useSidebar must be used inside SidebarProvider");
    }
    return context;

}
