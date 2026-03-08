import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/db"
import User from "../../../models/user.model";
import bcrypt from "bcrypt"

export async function GET() {
  await connectToDatabase();

  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

  if (adminExists) {
    return NextResponse.json({ message: "Admin already exists" });
  }

  const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  const admin = await User.create({
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    password: hashPassword,
    role: "admin",
  });

  return NextResponse.json({
    message: "Admin created",
    admin,
  });
}