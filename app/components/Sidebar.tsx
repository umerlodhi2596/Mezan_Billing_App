"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../(dashboard)/context/SidebarProvider";

const menuItems = [
  { name: "Dashboard", href: "/" },
  { name: "Create Invoice", href: "/create-invoice" },
  { name: "Invoices", href: "/invoices" },
  { name: "Admins", href: "/admins" },
];

export default function Sidebar() {
  const { open, setOpen } = useSidebar();
  const pathName = usePathname();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-white text-2xl font-semibold border-b border-gray-700 py-5 text-center uppercase">
          Invoice <span className="text-blue-600">App</span>
        </h2>

        <ul className="py-6 px-4">
          {menuItems.map((item, index) => {
            const isActive = item.href === pathName;

            return (
              <Link key={index} href={item.href}>
                <li
                  onClick={() => setOpen(false)}
                  className={`${
                    isActive ? "text-blue-500" : "text-white"
                  } px-5 py-3 bg-gray-800 mb-3 rounded cursor-pointer`}
                >
                  {item.name}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </>
  );
}