/* eslint-disable react-hooks/rules-of-hooks */
import {
  BanknoteArrowDown,
  ChevronRight,
  CreditCard,
  FileText,
  IdCard,
  Wallet,
} from "lucide-react";
import React from "react";
import db from "@/lib/db";
import { useRider } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import { TabBar } from '@/components/layouts/tab-bar';

const Page = async () => {
  const { rider } = await useRider();
  if (!rider) redirect("/sign-in");

  // Fetch all orders for this rider
  const orders = await db.order.findMany({
    where: { riderId: rider.id },
    include: {
      orderItem: true,
    },
  });

  // Only include orders that are "Delivered" based on order items
  const totalRevenue = orders
    .filter((order) =>
      order.orderItem.some((item) => item.status === "Delivered")
    )
    .reduce((sum, order) => sum + (order.deliveryFee ?? 0), 0);

  return (
    <div>
      <h3 className="text-center mt-4 font-semibold">Wallet</h3>
      <div className="bg-primary p-5 mt-3">
        <p className="text-white text-sm">Balance</p>
        <h3 className="text-white mt-2 text-3xl font-medium">
          ₱{totalRevenue.toFixed(2)}
        </h3>
        <div className="mt-16">
          <p className="text-white text-sm">Deposit</p>
          <h3 className="text-white mt-1 text-lg font-medium">₱0.00</h3>
        </div>
        <div className="mt-5">
          <p className="text-white text-sm">Under Review</p>
          <h3 className="text-white mt-1 text-lg font-medium">₱0.00</h3>
        </div>
      </div>

      <div>
        <div className="py-3 border-b pl-5 pr-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className="text-primary size-4" />
            <p className="text-sm">Top up</p>
          </div>
          <ChevronRight className="size-4" />
        </div>
        <div className="py-3 border-b pl-5 pr-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BanknoteArrowDown className="text-primary size-4" />
            <p className="text-sm">Withdraw</p>
          </div>
          <ChevronRight className="size-4" />
        </div>
        <div className="py-3 border-b pl-5 pr-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-primary size-4" />
            <p className="text-sm">Balance Details</p>
          </div>
          <ChevronRight className="size-4" />
        </div>
        <div className="py-3 border-b pl-5 pr-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IdCard className="text-primary size-4" />
            <p className="text-sm">Account Details</p>
          </div>
          <ChevronRight className="size-4" />
        </div>
        <div className="py-3 border-b pl-5 pr-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="text-primary size-4" />
            <p className="text-sm">Payment Method</p>
          </div>
          <ChevronRight className="size-4" />
        </div>
      </div>
      <TabBar />
    </div>
  );
};

export default Page;
