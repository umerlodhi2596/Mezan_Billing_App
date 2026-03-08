import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/db";
import Invoice from "../../../../models/invoice.model";

export async function GET() {
  try {
    await connectToDatabase();
    const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });

    const nextInvoiceNumber = lastInvoice
      ? Number(lastInvoice.invoiceNumber) + 1
      : 1;

    return NextResponse.json({
      success: true,
      nextInvoiceNumber,
    });
  } catch (error) {
    console.error("Error getting next invoice number:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}