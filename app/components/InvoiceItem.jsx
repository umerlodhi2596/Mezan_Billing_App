"use client"
import { EllipsisVertical } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


export default function InvoiceItem({ invoice }) {

  const router = useRouter();

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const dateObj = new Date(invoice.date);
  const currDate = dateObj.toISOString().split("T")[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUpdate = (id) => {
    router.push(`/update-invoice/${id}`);
    setOpen(false);
  };

  const handleDelete = async (id) => {

    const res = await fetch(`http://localhost:3000/api/invoice/${id}`, {
      method: 'DELETE'
    });

    if(!res.ok) {
      throw new Error("Invoice cannot Deleted");
    } 

    setOpen(false);
    return res.json();
    
  };

  

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
    }
  })

  return (
    <div className="relative bg-gray-900 rounded-xl py-6 pl-8 pr-16 shadow-md border border-gray-700 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-200 font-medium text-2xl mb-1">
            <span className="capitalize pr-2.5">Invoice Title:</span>
            <span>{invoice.billTo}</span>
          </h3>
          <p className="text-gray-400 text-sm">
            Invoice #: {invoice.invoiceNumber}
          </p>
          <p className="text-gray-400 text-sm mt-1">Date: {currDate}</p>
        </div>

        <div className="text-right">
          <p className="text-blue-500 font-bold text-xl">Total Amount</p>
          <p className="text-gray-200 font-semibold text-2xl mt-1">
            Rs: {invoice.totalAmount}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-4"></div>

      <div className="mt-3 flex gap-2 items-center text-gray-400 text-sm">
        <span className="font-medium">Status:</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200
          ${
            invoice.status === "paid"
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-red-100 text-red-700 border-red-300"
          }`}
        >
          {invoice.status === "paid" ? "Paid" : "Unpaid"}
        </span>
      </div>

      {/* Dropdown */}
      <div className="absolute top-3 right-2" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full hover:bg-gray-700 transition"
        >
          <EllipsisVertical size={22} className="text-gray-300" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => handleUpdate(invoice._id)}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition"
            >
              Update
            </button>

            <button
              disabled={mutation.isPending}
              onClick={() => {
                if(confirm("Press ok to delete")) {
                  mutation.mutate(invoice._id)
                }
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition"
            >
              {mutation.isPending ? "Deleting...": "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
