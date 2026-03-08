"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Trash, X } from "lucide-react";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// ------------------- Yup Validation Schema -------------------
const AdminSchema = Yup.object().shape({
  username: Yup.string()
    .matches(/^\S*$/, "Username cannot contain spaces") // no spaces
    .required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().when("isUpdate", (isUpdate, schema) =>
    isUpdate ? schema : schema.required("Password is required"),
  ),
});

export default function UsersTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 5;

  const [modal, setModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ------------------- FETCH USERS -------------------
  const { data, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const res = await fetch(
        `/api/users?page=${page}&limit=${limit}`,
      );
      const data = await res.json();
      return data;
    },
  });

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // ------------------- CREATE ADMIN -------------------
  const createUserMutation = useMutation({
    mutationFn: async (body) => {
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, role: "admin" }),
      });
      if (!res.ok) throw new Error("Failed to create admin");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Admin created successfully");
      queryClient.invalidateQueries(["users"]);
      setModal(false);
    },
    onError: () => toast.error("Failed to create admin"),
  });

  // ------------------- UPDATE ADMIN -------------------
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, body }) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update admin");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Admin updated successfully");
      queryClient.invalidateQueries(["users"]);
      setUpdateModal(false);
      setSelectedUser(null);
    },
    onError: () => toast.error("Failed to update admin"),
  });

  // ------------------- DELETE ADMIN -------------------
  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete admin");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Admin deleted successfully");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => toast.error("Failed to delete admin"),
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setUpdateModal(true);
  };

  <div className="flex items-center justify-center h-96">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>;

  return (
    <div className="overflow-x-auto">
      {/* Add Admin Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModal(true)}
          className="text-white bg-blue-500 px-5 py-3 rounded font-medium hover:bg-blue-600"
        >
          Add Admin
        </button>
      </div>

      {/* Modal */}
      {(modal || updateModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-96 p-8 relative">
            <button
              onClick={() => {
                setModal(false);
                setUpdateModal(false);
                setSelectedUser(null);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-lg text-white bg-gray-800"
            >
              <X />
            </button>
            <h3 className="text-white text-2xl pb-4">
              {updateModal ? "Update Admin" : "Add New Admin"}
            </h3>

            <Formik
              initialValues={{
                username: selectedUser?.username || "",
                email: selectedUser?.email || "",
                password: "",
                isUpdate: updateModal,
              }}
              validationSchema={AdminSchema}
              onSubmit={(values) => {
                const payload = {
                  username: values.username,
                  email: values.email,
                };
                if (values.password) payload.password = values.password;

                if (updateModal && selectedUser) {
                  updateUserMutation.mutate({
                    id: selectedUser._id,
                    body: payload,
                  });
                } else {
                  createUserMutation.mutate(payload);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <Field
                      name="username"
                      placeholder="Username"
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email"
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <Field
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 bg-blue-500 px-4 py-2 rounded text-white"
                  >
                    {updateModal ? "Update Admin" : "Save Admin"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Users Table */}
      <table className="min-w-full shadow rounded-lg">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
              Username
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
              Email
            </th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900">
          {data?.users?.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-white py-4">
                No admins found
              </td>
            </tr>
          ) : (
            data?.users?.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 text-white">{user.username}</td>
                <td className="px-6 py-4 text-white">{user.email}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => handleUpdateClick(user)}
                    className="text-blue-600 bg-gray-800 p-3 rounded hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 bg-gray-800 p-3 rounded hover:text-red-800"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Prev
        </button>

        {/* show page numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1; // actual page number
          return (
            <button
              key={i}
              onClick={() => setPage(pageNumber)}
              className={`px-3 py-1 rounded ${
                page === pageNumber
                  ? "bg-blue-700 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {pageNumber} {/* use pageNumber instead of page */}
            </button>
          );
        })}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
