"use client";
import { useReactToPrint } from "react-to-print";
import { useRef, useState, useEffect } from "react";
import { Plus, Printer, Save, X } from "lucide-react";
import toast from "react-hot-toast";

export default function Invoice() {
  let [loading, setLoading] = useState(false);
  const printRef = useRef(null);
  let [items, setItems] = useState([
    { productDetail: "", qtyDetail: "", qty: 0, tp: 0 },
  ]);

  let [billTo, setBillTo] = useState("");
  let [suggestions, setSuggestions] = useState([]);
  let [invoiceNumber, setInvoiceNumber] = useState("");
  let [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const fetchNextInvoiceNumber = async () => {
    const res = await fetch("/api/invoice/next-number");
    const data = await res.json();
    return data.nextInvoiceNumber;
  };

  useEffect(() => {
    fetchNextInvoiceNumber().then((num) => setInvoiceNumber(num));
  }, []);

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

  const handleAddRow = () => {
    if (items.length < 13) {
      setItems([...items, { productDetail: "", qtyDetail: "", qty: 0, tp: 0 }]);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...items];

    updated[index][field] = value;

    if (field === "qtyDetail") {
      updated[index].qty = calculateQty(value);
    }

    setItems(updated);
  };

  const handleSave = async () => {
    const allFilled = items.every(
      (item) => item.productDetail && item.productDetail.trim() !== "",
    );

    if (!allFilled) {
      alert("Please fill the product details for all items before saving.");
      return;
    }

    if (!invoiceNumber) {
      alert("Please Enter Invoice Number");
      return;
    }

    const invoiceData = {
      invoiceNumber,
      billTo,
      date,
      items,
      totalAmount,
    };

    try {
      setLoading(true);
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });
      setInvoiceNumber("");
      setBillTo("");
      setItems([{ productDetail: "", qtyDetail: "", qty: 0, tp: 0 }]);
      toast.success("Invoice Save Successfully");
    } catch (error) {
      console.log(error.message || "Post request error");
    } finally {
      setLoading(false);
    }
  };

  const handleBillToFieldChange = async (e) => {
    const value = e.target.value;
    setBillTo(value);
    if (value.length === 0) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `/api/customer?search=${value}&limit=5`,
    );

    const data = await res.json();

    setSuggestions(data.customers);
  };

  const handleDelete = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);

    setItems(updatedItems);
  };

  const totalAmount = items.reduce((acc, item) => acc + item.qty * item.tp, 0);

  const handleSelect = (customer) => {
    setBillTo(customer.customerName);
    setSuggestions([]);
  };

  function calculateQty(detail) {
    const matches = detail.match(/\/(\d+)/g);

    if (!matches) return 0;

    return matches.reduce((sum, item) => {
      return sum + Number(item.replace("/", ""));
    }, 0);
  }

  return (
    <>
      {/* Printable Area */}
      <div
        ref={printRef}
        className="bg-gray-900 px-10 py-12 w-full rounded 
                   print:bg-white print:text-black print:px-8 print:py-10"
      >
        {/* Header */}
        <div className="pb-6 border-b border-gray-600 print:border-black">
          <h1 className="text-4xl font-extrabold text-white print:text-black uppercase tracking-wide">
            Mezan Marketing System
          </h1>
          <p className="text-md font-medium text-white print:text-black">
            Orthopedic Products
          </p>
        </div>

        {/* Billing Info */}
        <div className="flex justify-between py-8">
          <div className="relative">
            <label className="block text-sm text-white print:text-black mb-1">
              Bill To
            </label>
            <input
              type="text"
              onChange={handleBillToFieldChange}
              value={billTo}
              className="border border-gray-700 rounded w-92 px-4 py-2 text-xl outline-none text-white print:border print:border-black print:text-black"
            />
            {billTo && suggestions.length > 0 && (
              <div className="absolute bg-gray-800 text-white w-full mt-1 rounded shadow z-10">
                {suggestions.map((customer) => (
                  <div
                    key={customer._id}
                    onClick={() => handleSelect(customer)}
                    className="p-2 cursor-pointer hover:bg-blue-500"
                  >
                    <p className="font-medium">{customer.customerName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div>
              <label className="block text-sm text-white print:text-black mb-1">
                Invoice #
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="border border-gray-700 rounded w-45 px-4 py-2 text-lg outline-none text-white print:border print:border-black print:text-black"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-white print:text-black mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-700 rounded w-45 px-4 py-2 text-lg outline-none text-white print:border print:border-black print:text-black"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-700 text-white print:text-black p-2 w-[5%]">
                S#
              </th>
              <th className="border border-gray-700 text-white print:text-black p-2 w-[35%]">
                Product Detail
              </th>
              <th className="border border-gray-700 text-white print:text-black p-2 w-[25%]">
                Quantity Detail
              </th>
              <th className="border border-gray-700 text-white print:text-black p-2 w-[10%]">
                Qty
              </th>
              <th className="border border-gray-700 text-white print:text-black p-2 w-[10%]">
                T.P
              </th>
              <th className="border border-gray-700 text-white print:text-black p-2 w-[15%]">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              let amount = item.qty * item.tp;

              return (
                <tr key={index} className="group hover:bg-gray-800 relative">
                  <td className="border border-gray-500 text-center text-white print:text-black">
                    {index + 1}
                  </td>

                  {/* Product Detail */}
                  <td className="border border-gray-500 p-0">
                    <input
                      type="text"
                      value={item.productDetail}
                      onChange={(e) =>
                        handleChange(index, "productDetail", e.target.value)
                      }
                      className="w-full bg-transparent outline-none px-3 py-2 text-white print:hidden"
                    />
                    <span className="hidden print:inline-block w-full px-3 py-2 text-black">
                      {item.productDetail}
                    </span>
                  </td>

                  {/* Quantity Detail */}
                  <td className="border border-gray-500 p-0">
                    <input
                      type="text"
                      onChange={(e) =>
                        handleChange(index, "qtyDetail", e.target.value)
                      }
                      value={item.qtyDetail}
                      className="w-full bg-transparent outline-none px-3 py-2 text-white print:hidden"
                    />
                    <span className="hidden print:inline-block text-sm text-center w-full px-3 py-2 text-black">
                      {item.qtyDetail}
                    </span>
                  </td>

                  {/* Qty */}
                  <td className="border border-gray-500 p-0">
                    <input
                      type="number"
                      value={item.qty}
                      readOnly
                      className="w-full bg-transparent outline-none px-3 py-2 text-white print:hidden"
                    />
                    <span className="hidden print:inline-block w-full px-3 py-2 text-black text-center">
                      {item.qty}
                    </span>
                  </td>

                  {/* T.P */}
                  <td className="border border-gray-500 p-0">
                    <input
                      type="number"
                      onChange={(e) =>
                        handleChange(index, "tp", e.target.value)
                      }
                      value={item.tp}
                      className="w-full bg-transparent outline-none px-3 py-2 text-white print:hidden"
                    />
                    <span className="hidden print:inline-block w-full px-3 py-2 text-black text-center">
                      {item.tp}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="border border-gray-500 p-0 text-center">
                    <span className="print:inline-block w-full px-3 py-2 text-white print:text-black text-center">
                      {amount}
                    </span>
                  </td>
                  <td className="absolute -right-10 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
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
              <td className="border border-gray-700 text-center font-bold p-2 text-white print:text-black">
                {totalAmount}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Add Button (Hidden in Print) */}
        <div className="mt-6 print:hidden">
          <button
            onClick={handleAddRow}
            className="bg-gray-800 text-white rounded py-2 px-5 
                             font-medium flex items-center gap-2 hover:bg-gray-700"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="print:hidden mt-8 flex items-center gap-5">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white py-3 px-5 rounded 
                     font-medium flex items-center gap-2 hover:bg-blue-600"
        >
          <Printer size={18} /> Print Now
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className={`bg-green-600 text-white py-3 px-5 rounded 
                     font-medium flex items-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"} `}
        >
          <Save size={18} /> {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}
