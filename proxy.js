export {auth as proxy} from "./auth"

// proxy.js
import { NextResponse } from "next/server";

export function proxy(req) {
  const userAgent = req.headers.get("user-agent") || "";

  // 1️⃣ Mobile detection
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
  if (isMobile) {
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
  
}

export const config = {
  matcher: "/:path*",
};