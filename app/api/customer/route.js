import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/db";
import Customer from "../../../models/customer.model";

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    await Customer.create(body);

    return NextResponse.json({
      message: "Customer Added Successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    let sortParams = searchParams.get("sort");
    let search =  searchParams.get("search");

    let query = {}

    if(search) {
      query = {
        customerName: {$regex: search, $options: "i"}
      }
    }

    const skip = (page - 1) * limit;

    let sort = { createdAt: -1 };

    if (sortParams === "Oldest") sort = { createdAt: 1 };

    const customers = await Customer.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const totalCustomers = await Customer.countDocuments(query);

    const totalPages = Math.ceil(totalCustomers / limit);

    return NextResponse.json({
      customers,
      totalCustomers,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
