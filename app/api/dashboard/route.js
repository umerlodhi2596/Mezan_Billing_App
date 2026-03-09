import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/db";
import Customer from "../../../models/customer.model";
import Invoice from "../../../models/invoice.model";

export async function GET() {
  try {
    await connectToDatabase();

    const totalCustomers = await Customer.countDocuments();
    const totalInvoices = await Invoice.countDocuments();

    const paidBills = await Invoice.countDocuments({ status: "paid" });
    const unpaidBills = await Invoice.countDocuments({ status: "unpaid" });

    const revenueData = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const monthlyTotal = await Invoice.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    return NextResponse.json({
      totalCustomers,
      totalInvoices,
      paidBills,
      unpaidBills,
      totalRevenue,
      monthlyTotal,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
