import Sidebar from "../components/Sidebar";
import "../globals.css";
import Navbar from "../components/Navbar";
import SidebarProvider from "./context/SidebarProvider";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "../components/ReactQueryProvider";
import { auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <Toaster />

      <ReactQueryProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-gray-950">
            <Sidebar />

            <div className="flex flex-col flex-1">
              <Navbar />

              <main className="flex-1">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </ReactQueryProvider>
    </>
  );
}
