// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const userAgent = req.headers.get("user-agent") || "";

  // Regex to detect mobile devices
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);

  if (isMobile) {
    // Return a simple HTML page for mobile users
    return new NextResponse(
      `
      <html>
        <head>
          <title>Desktop Only</title>
          <style>
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              font-family: sans-serif; 
              text-align: center;
              background: #f8f8f8;
            }
          </style>
        </head>
        <body>
          <h1>⚠️ This app is only supported on desktop/laptop screens.</h1>
        </body>
      </html>
      `,
      {
        status: 403,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  return NextResponse.next(); // allow desktop users
}

// Apply middleware to all routes
export const config = {
  matcher: "/:path*", // runs on all paths
};