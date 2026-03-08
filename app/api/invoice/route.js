import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/db";
import Invoice from "../../../models/invoice.model";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    if (!body.invoiceNumber || !body.items || !body.totalAmount) {
      return NextResponse.json(
        { error: "Missing required invoice fields" },
        { status: 400 },
      );
    }

    const newInvoice = await Invoice.create(body);

    return NextResponse.json(
      { message: "Invoice saved successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving invoice:", error);
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

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const sortParams = searchParams.get("sort");

    let query = {};

    const skip = (page - 1) * limit;

    if (search) {
      query = {
        $or: [
          { invoiceNumber: { $regex: search, $options: "i" } },
          { billTo: { $regex: search, $options: "i" } },
        ],
      };
    }
    let sort = { createdAt: -1 };

    if (sortParams === "Oldest") sort = { createdAt: 1 };
    const invoices = await Invoice.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const total = await Invoice.countDocuments();

    return NextResponse.json({
      success: true,
      invoices,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalInvoices: total,
    });
  } catch (error) {
    console.error("Error saving invoice:", error);
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
