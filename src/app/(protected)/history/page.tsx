/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import db from "@/lib/db";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  IconCoins,
  IconMapPinFilled,
  IconStarFilled,
  IconStar,
} from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabBar } from "@/components/layouts/tab-bar";
import { useRider } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import Link from "next/link";

const STATUS_PRIORITY = [
  "Cancelled",
  "Pending",
  "Accepted",
  "Processing",
  "Out For Delivery",
  "Delivered",
];

const Page = async () => {
  const { rider } = await useRider();
  if (!rider) redirect("/sign-in");

  const orders = await db.order.findMany({
    where: { riderId: rider.id },
    include: {
      address: true,
      orderItem: {
        include: {
          product: true,
          vendor: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Categorize orders based on orderItem status
  const categorizeOrders = (orders: any[]) => {
    const ongoing: any[] = [];
    const completed: any[] = [];
    const canceled: any[] = [];

    orders.forEach((order) => {
      // Determine highest-priority status from order items
      const status = order.orderItem
        .map((i: any) => i.status)
        .sort(
          (a: string, b: string) => STATUS_PRIORITY.indexOf(a) - STATUS_PRIORITY.indexOf(b)
        )
        .pop();

      if (["Accepted", "Out For Delivery", "Processing"].includes(status))
        ongoing.push({ ...order, status });
      else if (status === "Delivered") completed.push({ ...order, status });
      else if (status === "Cancelled") canceled.push({ ...order, status });
    });

    return { ongoing, completed, canceled };
  };

  const { ongoing, completed, canceled } = categorizeOrders(orders);

  // Helper for star rating
  const renderStars = (rating = 5) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating)
        stars.push(
          <IconStarFilled key={i} className="text-yellow-500 size-4" />
        );
      else stars.push(<IconStar key={i} className="text-yellow-500 size-4" />);
    }
    return stars;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const renderOrderCard = (order: any, type: "ongoing" | "completed" | "canceled") => {
    let href = `/history/${order.id}`;
    if (order.status === "Accepted") href += "/order-accepted";
    else if (order.status === "Out For Delivery") href += "/order-completed";

    return (
      <Link key={order.id} href={href} className="block">
        <div className="active:bg-black/5 cursor-pointer">
          <div className="p-3 bg-primary flex items-center justify-between text-white">
            <p className="font-medium text-sm">
              {type === "completed"
                ? "Completed"
                : type === "canceled"
                ? "Cancelled"
                : order.status}
            </p>
            <p className="font-medium text-sm">
              {formatDate(order.updatedAt)}
            </p>
          </div>

          <div className="p-3 border shadow rounded-bl-sm rounded-br-sm">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-zinc-200">
                {order.vehicleType || "Motorcycle"}
              </Badge>
              {type === "completed" && (
                <div className="flex gap-0.5">{renderStars()}</div>
              )}
            </div>

            {/* Pickup & Dropoff */}
            <div className="flex flex-col mt-4 gap-1">
              <div className="flex items-center gap-2">
                <Circle className="size-3 text-primary" />
                <p className="text-xs font-medium line-clamp-1">
                  {order.orderItem[0]?.vendor.vendorAddress?.[0]?.address ??
                    "Pickup Location"}
                </p>
              </div>
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-2.5 ml-[5px]"
              />
              <div className="flex items-center gap-2">
                <IconMapPinFilled className="size-3 text-primary" />
                <p className="text-xs font-medium line-clamp-1">
                  {order.address?.homeAddress ?? "Drop-off"}
                </p>
              </div>
            </div>

            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <IconCoins className="text-primary size-5" />
              <p className="font-bold">
                ₱{(order.deliveryFee ?? 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const renderTabContent = (
    items: any[],
    type: "ongoing" | "completed" | "canceled"
  ) => {
    if (!items.length)
      return (
        <div className="flex h-[60vh] items-center justify-center flex-col">
          <Image src="/empty.svg" alt="Empty" width={100} height={100} />
          <p className="mt-3 text-zinc-500">No {type} orders</p>
        </div>
      );

    return (
      <div className="space-y-6 px-3 h-[80vh] overflow-y-auto hide-scrollbar pb-22">
        {items.map((order) => renderOrderCard(order, type))}
      </div>
    );
  };

  return (
    <div>
      <div className="w-full max-w-full">
        <Tabs defaultValue="ongoing" className="gap-4 w-full max-w-full py-2">
          <TabsList className="bg-background rounded-none border-b p-0 w-full">
            <TabsTrigger
              value="ongoing"
              className="bg-background data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
            >
              Ongoing
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="bg-background data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="canceled"
              className="bg-background data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
            >
              Canceled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ongoing">
            {renderTabContent(ongoing, "ongoing")}
          </TabsContent>
          <TabsContent value="completed">
            {renderTabContent(completed, "completed")}
          </TabsContent>
          <TabsContent value="canceled">
            {renderTabContent(canceled, "canceled")}
          </TabsContent>
        </Tabs>
      </div>

      <TabBar />
    </div>
  );
};

export default Page;
