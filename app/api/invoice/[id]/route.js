import connectToDatabase from "../../../../lib/db";
import Invoice from "../../../../models/invoice.model";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { id } = await params;

    await Invoice.findByIdAndUpdate(id, body);

    return NextResponse.json({
      message: "Invoice Updated Successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error Updating invoice:", error);
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const invoice = await Invoice.findById(id);

    return NextResponse.json({
      invoice,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message || "Server Error",
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await Invoice.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Invoice Deleted Successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message || "Server Error",
    });
  }
}
