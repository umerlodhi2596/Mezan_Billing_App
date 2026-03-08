"use client";
import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import CustomerTable from "../components/CustomerTable";

import {
  User,
  DollarSign,
  FileText,
  ChartNoAxesCombined,
  Form,
  BadgeAlert,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  console.log(stats);

  useEffect(() => {
    async function getDashboardData() {
      try {
        const res = await fetch("http://localhost:3000/api/dashboard");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getDashboardData();
  }, []);

  console.log(stats);

  function DashboardCardSkeleton() {
    return (
      <div className="flex items-center gap-5 p-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-700"></div>

        <div className="space-y-2">
          <div className="w-32 h-4 bg-gray-700 rounded"></div>
          <div className="w-16 h-6 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="px-10 py-6">
        <div className="w-full px-5 py-8 bg-gray-900 rounded-2xl">
          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              <>
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
              </>
            ) : (
              <>
                <DashboardCard
                  title="Total Customers"
                  value={stats.totalCustomers}
                  icon={<User size={32} />}
                  iconBg="bg-blue-100"
                  iconColor="text-blue-600"
                />

                <DashboardCard
                  title="Total Invoices"
                  value={stats.totalInvoices}
                  icon={<FileText size={32} />}
                  iconBg="bg-yellow-100"
                  iconColor="text-yellow-600"
                />

                <DashboardCard
                  title="Total Revenue"
                  value={stats.totalRevenue}
                  icon={<DollarSign size={32} />}
                  iconBg="bg-green-100"
                  iconColor="text-green-600"
                />
              </>
            )}
          </div>
        </div>
        <div className="w-full px-5 py-8 bg-gray-900 rounded-2xl my-5">
          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              <>
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
              </>
            ) : (
              <>
                <DashboardCard
                  title="This Month Sale"
                  icon={<ChartNoAxesCombined size={32} />}
                  iconBg="bg-pink-100"
                  iconColor="text-pink-600"
                  value={stats.monthlyTotal}
                />

                <DashboardCard
                  title="Paid Bills"
                  icon={<Form size={32} />}
                  iconBg="bg-purple-100"
                  iconColor="text-purple-600"
                  value={stats.paidBills}
                />

                <DashboardCard
                  title="Unpaid Bills"
                  icon={<BadgeAlert size={32} />}
                  iconBg="bg-red-100"
                  iconColor="text-red-600"
                  value={stats.unpaidBills}
                />
              </>
            )}
          </div>
        </div>
        <div>
          <CustomerTable />
        </div>
      </section>
    </>
  );
}
