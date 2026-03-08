"use client";

import { useReactToPrint } from "react-to-print";
import { useRef, useState, useEffect } from "react";
import { Plus, Printer, Save, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function UpdateInvoiceItem() {
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const printRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([
    { productDetail: "", qtyDetail: "", qty: 0, tp: 0 },
  ]);

  const [billTo, setBillTo] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("unpaid");

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  // CTRL + P print
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handlePrint]);

  // Fetch Invoice
  useEffect(() => {
    const fetchInvoice = async () => {
      setLoadingInvoice(true);
      try {
        const res = await fetch(`/api/invoice/${id}`);
        const data = await res.json();

        setInvoiceNumber(data?.invoice.invoiceNumber);
        setBillTo(data?.invoice.billTo);
        setDate(data?.invoice.date.split("T")[0]);
        setItems(data?.invoice.items);
        setStatus(data?.invoice.status || "unpaid");
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingInvoice(false);
      }
    };

    if (id) fetchInvoice();
  }, [id]);

  const handleAddRow = () => {
    if (items.length < 13) {
      setItems([...items, { productDetail: "", qtyDetail: "", qty: 0, tp: 0 }]);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleDelete = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const totalAmount = items.reduce((acc, item) => acc + item.qty * item.tp, 0);

  const handleSave = async () => {
    const allFilled = items.every(
      (item) => item.productDetail && item.productDetail.trim() !== "",
    );

    if (!allFilled) {
      alert("Please fill the product details for all items before saving.");
      return;
    }

    const invoiceData = {
      invoiceNumber,
      billTo,
      date,
      items,
      totalAmount,
      status,
    };

    try {
      setLoading(true);

      const res = await fetch(`/api/invoice/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (!res.ok) {
        throw new Error("Failed to update invoice");
      }

      alert("Invoice Updated Successfully");

      router.push("/invoices");
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingInvoice) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-dashed border-white rounded-full animate-spin"></div>
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={printRef}
        className="bg-gray-900 px-10 py-12 w-full rounded print:bg-white print:text-black"
      >
        {/* Header */}
        <div className="pb-6 border-b border-gray-600 print:border-black">
          <h1 className="text-4xl font-extrabold text-white print:text-black uppercase">
            Mezan Marketing System
          </h1>
          <p className="text-md font-medium text-white print:text-black">
            Orthopedic Products
          </p>
        </div>

        {/* Billing Info */}
        <div className="flex justify-between py-8">
          <div>
            <label className="block text-sm text-white mb-1 print:text-black">
              Bill To
            </label>

            <input
              type="text"
              value={billTo}
              onChange={(e) => setBillTo(e.target.value)}
              className="border border-gray-700 rounded w-92 px-4 py-2 text-xl outline-none text-white print:text-black"
            />
          </div>

          <div>
            <div>
              <label className="block text-sm text-white mb-1 print:text-black">
                Invoice #
              </label>

              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="border border-gray-700 rounded w-45 px-4 py-2 text-lg outline-none text-white print:text-black"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-white mb-1 print:text-black">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-700 rounded w-45 px-4 py-2 text-lg outline-none text-white print:text-black"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-700 p-2 text-white print:text-black w-[5%]">
                S#
              </th>
              <th className="border border-gray-700 p-2 text-white print:text-black w-[35%]">
                Product Detail
              </th>
              <th className="border border-gray-700 p-2 text-white print:text-black w-[25%]">
                Quantity Detail
              </th>
              <th className="border border-gray-700 p-2 text-white print:text-black w-[10%]">
                Qty
              </th>
              <th className="border border-gray-700 p-2 text-white print:text-black w-[10%]">
                T.P
              </th>
              <th className="border border-gray-700 p-2 text-white print:text-black w-[15%]">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              const amount = item.qty * item.tp;

              return (
                <tr key={index} className="group relative">
                  <td className="border border-gray-500 text-center text-white print:text-black">
                    {index + 1}
                  </td>

                  <td className="border border-gray-500">
                    <input
                      value={item.productDetail}
                      onChange={(e) =>
                        handleChange(index, "productDetail", e.target.value)
                      }
                      className="w-full bg-transparent px-3 py-2 text-white print:hidden"
                    />
                    <span className="hidden print:block px-3 py-2">
                      {item.productDetail}
                    </span>
                  </td>

                  <td className="border border-gray-500">
                    <input
                      value={item.qtyDetail}
                      onChange={(e) =>
                        handleChange(index, "qtyDetail", e.target.value)
                      }
                      className="w-full bg-transparent px-3 py-2 text-white print:hidden"
                    />
                    <span className="hidden print:block px-3 py-2">
                      {item.qtyDetail}
                    </span>
                  </td>

                  <td className="border border-gray-500">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        handleChange(index, "qty", Number(e.target.value))
                      }
                      className="w-full bg-transparent px-3 py-2 text-white print:hidden"
                    />
                    <span className="hidden print:block text-center">
                      {item.qty}
                    </span>
                  </td>

                  <td className="border border-gray-500">
                    <input
                      type="number"
                      value={item.tp}
                      onChange={(e) =>
                        handleChange(index, "tp", Number(e.target.value))
                      }
                      className="w-full bg-transparent px-3 py-2 text-white print:hidden"
                    />
                    <span className="hidden print:block text-center">
                      {item.tp}
                    </span>
                  </td>

                  <td className="border border-gray-500 text-center text-white print:text-black">
                    {amount}
                  </td>

                  <td className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 print:hidden">
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-1 bg-gray-700 hover:text-red-500"
                    >
                      <X />
                    </button>
                  </td>
                </tr>
              );
            })}

            <tr>
              <td
                colSpan={5}
                className="border border-gray-700 text-right font-bold p-2 text-xl text-white print:text-black"
              >
                Total
              </td>

              <td className="border border-gray-700 text-center font-bold text-white print:text-black">
                {totalAmount}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Add Item */}
        <div className="mt-6 print:hidden">
          <button
            onClick={handleAddRow}
            className="bg-gray-800 text-white rounded py-2 px-5 flex items-center gap-2 hover:bg-gray-700"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="print:hidden mt-8 flex items-end justify-between flex-wrap gap-5">
        {/* Buttons */}
        <div className="flex gap-5">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white py-3 px-5 rounded flex items-center gap-2 hover:bg-blue-600"
          >
            <Printer size={18} /> Print
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`bg-green-600 text-white py-3 px-5 rounded flex items-center gap-2 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            <Save size={18} /> {loading ? "Updating..." : "Update"}
          </button>
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-1 print:text-black">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-72 border border-gray-700 rounded px-4 py-2 bg-gray-900 text-white print:text-black"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>
    </>
  );
}
