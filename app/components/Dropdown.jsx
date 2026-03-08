"use client";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Dropdown({ limit, setLimit }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [5, 10, 15, 20];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-60 relative inline-block" ref={dropdownRef}>
      
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center justify-between"
      >
        Show {limit}
        <ChevronDown size={18} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute mt-2 w-full z-50 bg-gray-800 shadow-lg rounded">
          {options.map((item) => (
            <div
              key={item}
              onClick={() => {
                setLimit(item);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-400 ${
                limit === item ? "bg-gray-700" : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}