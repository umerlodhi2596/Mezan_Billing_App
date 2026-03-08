"use client";

import { Search, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CustomersTable() {
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState("Newest");
  const [search, setSearch] = useState("");

  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    customerName: "",
    location: "",
    status: "Active",
  });

  const nextPage = () => {
    if (page < data.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`http://localhost:3000/api/customer/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      return res.json();
    },
    onMutate: (id) => {
      setDeletingCustomerId(id);
    },
    onSettled: () => {
      // clear loading after success or error
      setDeletingCustomerId(null);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onSuccess: () => {
      toast.success("Customer Deleted");
    },
    onError: () => {
      toast.error("Delete Failed");
    },
  });

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`/api/customer/${selectedCustomer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: selectedCustomer.customerName,
          location: selectedCustomer.location,
          status: selectedCustomer.status,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update customer");
      }

      toast.success("Customer Updated");

      queryClient.invalidateQueries({ queryKey: ["customers"] });

      setUpdateModal(false);
    } catch (error) {
      toast.error("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = (id) => {
    deleteMutation.mutate(id);
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const [model, setModel] = useState(false);

  const getAllCustomers = async () => {
    const res = await fetch(
      `/api/customer?page=${page}&limit=${limit}&sort=${sort}&search=${search}`,
    );

    if (!res.ok) {
      throw new Error("Cannot get customers");
    }

    return res.json();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["customers", page, sort, search],
    queryFn: () => getAllCustomers(page, limit, sort, search),
    keepPreviousData: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (customer.customerName === "" || customer.location === "") {
      toast.error("Please Fill All Required Fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });

      if (!res.ok) {
        throw new Error("Failed to add customer");
      }

      setCustomer({
        customerName: "",
        location: "",
        status: "Active",
      });

      setModel(false);

      queryClient.invalidateQueries({ queryKey: ["customers"] });

      toast.success("Customer Added Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const SkeletonRow = () => {
    return (
      <tr className="border-b border-gray-800 animate-pulse">
        <td className="py-4">
          <div className="h-4 w-40 bg-gray-700 rounded"></div>
        </td>

        <td className="py-4">
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
        </td>

        <td className="py-4">
          <div className="h-6 w-20 bg-gray-700 rounded"></div>
        </td>

        <td className="py-4 flex justify-center">
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gray-700 rounded"></div>
            <div className="h-6 w-16 bg-gray-700 rounded"></div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-semibold">All Customers</h2>
          <p className="text-sm text-green-400">Active Members</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-800 text-white pl-9 pr-4 py-2 rounded-md outline-none border border-gray-700 focus:border-blue-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700"
          >
            <option>Newest</option>
            <option>Oldest</option>
          </select>
          <button
            onClick={() => setModel(true)}
            className="text-white bg-blue-500 px-5 py-3 rounded font-medium text-sm cursor-pointer"
          >
            Add Customer
          </button>
        </div>
      </div>

      {/* Modal */}
      {model && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg relative w-96 p-8">
            <button
              onClick={() => setModel(false)}
              className="absolute top-2 right-2 p-1.5 rounded-lg text-white bg-gray-800"
            >
              <X />
            </button>

            <h3 className="text-white text-2xl pb-4">Add Customer</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Customer Name"
                value={customer.customerName}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    customerName: e.target.value,
                  })
                }
                className="w-full mb-4 bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
              />

              <input
                type="text"
                placeholder="Location"
                value={customer.location}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    location: e.target.value,
                  })
                }
                className="w-full mb-4 bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
              />

              <select
                value={customer.status}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    status: e.target.value,
                  })
                }
                className="w-full mb-4 bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                disabled={loading}
                type="submit"
                className="flex w-full items-center justify-center gap-2 bg-blue-500 px-4 py-2 rounded text-white disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading
                  </>
                ) : (
                  "Save Customer"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {updateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg relative w-96 p-8">
            <button
              onClick={() => setUpdateModal(false)}
              className="absolute top-2 right-2 p-1.5 rounded-lg text-white bg-gray-800"
            >
              <X />
            </button>

            <h3 className="text-white text-2xl pb-4">Update Customer</h3>

            <form onSubmit={handleUpdateCustomer}>
              <input
                type="text"
                value={selectedCustomer?.customerName || ""}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    customerName: e.target.value,
                  })
                }
                className="w-full mb-4 bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
              />

              <input
                type="text"
                value={selectedCustomer?.location || ""}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    location: e.target.value,
                  })
                }
                className="w-full mb-4 bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
              />

              <select
                value={selectedCustomer?.status || "Active"}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    status: e.target.value,
                  })
                }
                className="w-full mb-4 bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 bg-blue-500 px-4 py-2 rounded text-white disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Update Customer"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-800 text-sm">
              <th className="py-3 pl-4 w-1/3">Customer Name</th>
              <th className="py-3 w-1/4">Location</th>
              <th className="py-3 w-1/5">Status</th>
              <th className="py-3 w-1/4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, index) => <SkeletonRow key={index} />)
            ) : data?.customers?.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-10 text-center text-gray-400 text-sm"
                >
                  No customers found
                </td>
              </tr>
            ) : (
              data?.customers?.map((customer) => (
                <tr
                  key={customer._id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition"
                >
                  <td className="pl-4 py-4 text-white">
                    {customer.customerName}
                  </td>
                  <td className="py-4 text-gray-300">{customer.location}</td>

                  <td className="py-4">
                    {customer.status === "Active" ? (
                      <span className="px-3 py-1 text-sm rounded-md bg-green-500/20 text-green-400 border border-green-500">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm rounded-md bg-red-500/20 text-red-400 border border-red-500">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setUpdateModal(true);
                        }}
                        className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 text-white"
                      >
                        Update
                      </button>

                      <button
                        disabled={deletingCustomerId === customer._id}
                        onClick={() => handleDeleteCustomer(customer._id)}
                        className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-500 text-white flex items-center justify-center w-17.5"
                      >
                        {deletingCustomerId === customer._id ? (
                          <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-6 text-sm text-gray-400">
        <p>
          Page {page} of {data?.totalPages || 1}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-40"
          >
            {"<"}
          </button>

          {[...Array(data?.totalPages || 1)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`px-3 py-1 rounded ${
                page === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={page === data?.totalPages}
            className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-40"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
