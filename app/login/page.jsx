"use client";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { handleBlur, handleChange, handleSubmit, errors, values, touched } =
    useFormik({
      initialValues: {
        username: "",
        email: "",
        password: "",
      },
      validationSchema: Yup.object({
        username: Yup.string()
          .required("Username is required")
          .matches(/^\S+$/, "Username must not contain spaces"),
        email: Yup.string().email("Please enter a valid email"),
        password: Yup.string()
          .required("Password is required")
          .min(8, "Password length must be atleast 8 characters"),
      }),
      onSubmit: async (values, { resetForm }) => {
        setLoading(true);
        const res = await signIn("credentials", {
          username: values.username,
          email: values.email,
          password: values.password,
          redirect: false, // IMPORTANT
        });

        console.log(res);
        setLoading(false);

        if (res?.error) {
          toast.error("Invalid username or password");
          resetForm();
          return;
        }

        if (res?.ok) {
          router.push("/");
          return;
        }
      },
    });

  return (
    <>
      <div className="w-full min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 w-100 px-8 py-10 rounded">
          <h2 className="text-center text-white text-3xl font-bold uppercase pb-5">
            <span className="text-blue-500">Mezan</span> Billing System
          </h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                name="username"
                className="w-full border border-transparent text-white bg-gray-800 rounded px-5 py-3 outline-none focus:border-blue-500"
              />
              {errors.username && touched.username && (
                <p className="text-red-500 text-xs font-medium pt-1">
                  {errors.username}
                </p>
              )}
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                className="w-full border border-transparent text-white bg-gray-800 rounded px-5 py-3 outline-none focus:border-blue-500"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs font-medium pt-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                name="password"
                className="w-full border border-transparent text-white bg-gray-800 rounded px-5 py-3 outline-none focus:border-blue-500"
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs font-medium pt-1">
                  {errors.password}
                </p>
              )}
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full mt-2 bg-blue-500 rounded-xl text-white py-3 font-medium hover:bg-blue-600 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
