import { NextResponse } from "next/server";
import Customer from "../../../../models/customer.model";
import connectToDatabase from "../../../../lib/db";

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase()
    const { id } = await params;

    await Customer.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Customer Deleted Successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Customer Updated Successfully",
      success: true,
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}


