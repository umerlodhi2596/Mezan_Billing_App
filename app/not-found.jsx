"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-9xl font-extrabold tracking-widest text-blue-500 mb-8">
        404
      </h1>
      <p className="text-2xl md:text-3xl mb-4">
        Oops! Page not found.
      </p>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-500 rounded hover:bg-blue-600 text-white font-medium transition"
      >
        Go Home
      </Link>
    </div>
  );
}