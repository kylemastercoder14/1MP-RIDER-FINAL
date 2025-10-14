"use client";

import React, { useEffect, useState } from "react";
import { Rider } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Circle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  IconAlertTriangleFilled,
  IconCoins,
  IconMapPinFilled,
} from "@tabler/icons-react";
import { getOrders } from "@/actions";
import { OrderWithProps } from "@/types";

const OrderList = ({ rider }: { rider: Rider }) => {
  const [orders, setOrders] = useState<OrderWithProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rider) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getOrders(rider.vehicleType ?? "");
        if (isMounted) setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [rider]);

  if (!rider) return null;

  return (
    <div>
      {rider.onDuty ? (
        <div>
          <div className="flex items-center gap-3 mt-5">
            <Image src="/motor.png" alt="Motor" width={80} height={80} />
            <div>
              <h3 className="font-medium text-sm">Want to take orders?</h3>
              <p className="text-xs text-zinc-600">
                Maximize your earning potential with available orders below.
              </p>
            </div>
          </div>

          <div className="space-y-5 h-[80vh] overflow-y-auto hide-scrollbar pb-22 mt-7">
            {loading ? (
              <div className="text-center h-[60vh] flex justify-center items-center gap-2 text-zinc-500 text-sm">
                <Loader2 className="animate-spin size-4" />
                Reloading new orders
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center text-zinc-500 text-sm">
                No available orders at the moment.
              </p>
            ) : (
              orders.map((order) => {
                const totalItems = order.orderItem.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );

                const stops = order.orderItem.map(
                  (item) => item.vendor.vendorAddress[0]?.address || "Unknown"
                );

                const uniqueStops = [...new Set(stops)].filter(Boolean);
                const firstStop = uniqueStops[0];
                const stopCount = uniqueStops.length;

                // ✅ Check if order has fragile item
                const hasFragile = order.orderItem.some(
                  (item) => item.product.isFragile === true
                );

                return (
                  <Link
                    href={`/history/${order.id}`}
                    key={order.id}
                    className="active:bg-black/5 mb-5 block"
                  >
                    {/* Header */}
                    <div className="bg-primary rounded-tl-sm rounded-tr-sm p-3 flex justify-between items-center">
                      <p className="text-white font-medium">
                        (~{totalItems} {totalItems > 1 ? "items" : "item"}) —
                        Pick up now
                      </p>
                    </div>

                    {/* Body */}
                    <div className="p-3 border shadow rounded-bl-sm rounded-br-sm">
                      <Badge variant="secondary" className="bg-zinc-200">
                        {order.vehicleType || "Motorcycle"}
                      </Badge>

                      <div className="flex flex-col mt-4 gap-1">
                        {/* Pickup summary */}
                        <div className="flex items-center gap-2">
                          <Circle className="size-3 fill-primary text-primary" />
                          <p className="text-xs line-clamp-1 font-medium">
                            {stopCount > 1
                              ? `${firstStop} (+${stopCount - 1} more stops)`
                              : firstStop}{" "}
                            (Pickup)
                          </p>
                        </div>

                        <Separator
                          orientation="vertical"
                          className="data-[orientation=vertical]:h-3 ml-[5px]"
                        />

                        {/* Dropoff */}
                        <div className="flex items-center gap-2">
                          <IconMapPinFilled className="size-3 text-primary" />
                          <p className="text-xs font-medium">
                            {order.address?.homeAddress ||
                              "Unknown destination"}{" "}
                            (Drop-off)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center mt-5 justify-between">
                        {hasFragile && (
                          <div className="flex items-center gap-2 text-yellow-600">
                            <IconAlertTriangleFilled className="size-4" />
                            <span className="text-xs font-medium">Fragile</span>
                          </div>
                        )}

                        {/* Weight total */}
                        <p className="text-right ml-auto text-sm font-semibold">
                          {order.orderItem.reduce(
                            (sum, item) =>
                              sum + (item.product.weight ?? 0) * item.quantity,
                            0
                          )}
                          {order.orderItem[0]?.product.weightUnit ?? "kg"} in
                          total
                        </p>
                      </div>

                      <Separator className="my-3" />

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <IconCoins className="text-primary size-5" />
                        <p className="font-bold">
                          ₱{order.deliveryFee?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      ) : (
        // Rider off-duty view
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
          <Image
            src="/offduty.svg"
            alt="Off Duty"
            width={200}
            height={200}
            className="mb-4 opacity-90"
          />
          <h2 className="text-lg font-semibold">You’re currently off duty</h2>
          <p className="text-sm text-zinc-600 max-w-xs mt-2">
            You won’t receive any delivery orders until you go on duty. Switch
            to “On Duty” to start accepting available orders in your area.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderList;
