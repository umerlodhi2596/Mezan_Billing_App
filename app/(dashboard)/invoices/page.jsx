"use client";

import React, { useState, useEffect } from "react";
import Heading from "../../components/Heading";
import InvoiceItem from "../../components/InvoiceItem";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Dropdown from "../../components/Dropdown";

export default function Invoices() {
    const [sort, setSort] = useState("Newest");
  let [limit, setLimit] = useState(5);
  let [page, setPage] = useState(1);
  let [search, setSearch] = useState("");

  async function getAllInvoices(page, limit, search) {
    const res = await fetch(
      `/api/invoice?page=${page}&limit=${limit}&search=${search}&sort=${sort}`,
    );

    if (!res.ok) {
      throw new Error("Cannot get all invoices");
    }

    return res.json();
  }

  const { data, isLoading } = useQuery({
    queryKey: ["invoices", page, limit, search, sort],
    queryFn: () => getAllInvoices(page, limit, search, sort),
    keepPreviousData: true,
  });

  function handlePageNext() {
    if (data.totalPages > page) {
      setPage(page + 1);
    }
  }

  function handlePageBack() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  return (
    <>
      <section className="px-10 py-6">
        <Heading heading="All Invoices" />
        <div className="flex items-center justify-between py-10 text-white">
          <div className="w-90 border border-gray-500 bg-gray-900 rounded px-5 py-2 flex items-center">
            <input
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              type="text"
              className="border-none outline-none w-full placeholder:text-white"
              placeholder="Search Invoice..."
            />
            <Search size={20} />
          </div>
          <div className="flex items-center gap-5">
            <Dropdown limit={limit} setLimit={setLimit} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-gray-900 text-white px-3 py-2 rounded-md outline-none"
            >
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>
        <div className="pt-5">
          {isLoading ? (
            [...Array(limit)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded py-15 px-5 animate-pulse flex items-center justify-between mb-5"
              >
                <div className="space-y-3">
                  <div className="h-4 w-40 bg-gray-600 rounded"></div>
                  <div className="h-3 w-24 bg-gray-700 rounded"></div>
                </div>

                <div className="h-6 w-20 bg-gray-600 rounded"></div>
              </div>
            ))
          ) : data.invoices.length === 0 ? (
            <div className="py-15 text-center">
              <h1 className="text-gray-300 text-2xl font-medium">
                No Invoice Found !
              </h1>
            </div>
          ) : (
            data.invoices.map((invoice, index) => (
              <InvoiceItem key={index} invoice={invoice} />
            ))
          )}
        </div>
        <div className="flex justify-center pt-6">
          <div className="flex items-center bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
            <button
              disabled={page === 1}
              onClick={handlePageBack}
              className={`flex items-center justify-center w-12 h-10 transition 
      ${
        page === 1
          ? "bg-gray-800 cursor-not-allowed text-gray-500"
          : "hover:bg-blue-500 text-white"
      }`}
            >
              <ChevronLeft size={22} />
            </button>

            <span className="px-6 text-white font-medium text-sm border-x border-gray-700">
              Page {page} / {data?.totalPages}
            </span>

            <button
              disabled={page === data?.totalPages}
              onClick={handlePageNext}
              className={`flex items-center justify-center w-12 h-10 transition 
      ${
        page === data?.totalPages
          ? "bg-gray-800 cursor-not-allowed text-gray-500"
          : "hover:bg-blue-500 text-white"
      }`}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
