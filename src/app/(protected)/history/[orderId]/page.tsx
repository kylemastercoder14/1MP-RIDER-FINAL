/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import db from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IconMapPinFilled, IconMessageFilled } from "@tabler/icons-react";
import AcceptOrderButton from "@/components/accept-order";
import { redirect } from "next/navigation";
import { useRider } from "@/hooks/use-user";
import { OrderItem } from "@prisma/client";
import { convertToKg } from "@/lib/utils";

interface VendorGroup {
  vendorName: string;
  businessType: string;
  contactNumber: string;
  pickupAddress: string;
  totalWeightKg: number;
  itemCount: number;
}

const Page = async (props: {
  params: Promise<{
    orderId: string;
  }>;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { rider } = await useRider();
  if (!rider) redirect("/sign-in");

  const params = await props.params;

  // ✅ Fetch order with related info
  const data = await db.order.findUnique({
    where: { id: params.orderId },
    include: {
      address: true,
      orderItem: {
        include: {
          product: true,
          vendor: {
            include: {
              vendorAddress: {
                where: { type: "Pickup", status: "Open" },
              },
            },
          },
        },
      },
    },
  });

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h2 className="text-lg font-semibold">Order not found</h2>
        <p className="text-sm text-zinc-600 max-w-xs mt-2">
          The order you're looking for may have been cancelled or removed.
        </p>
      </div>
    );
  }

  // ✅ Group items by vendor and convert all weights to kilograms
  const vendorGroups: VendorGroup[] = Object.values(
    data.orderItem.reduce(
      (acc: Record<string, VendorGroup>, item: OrderItem & any) => {
        if (!acc[item.vendorId]) {
          acc[item.vendorId] = {
            vendorName: item.vendor.name,
            businessType:
              item.vendor.businessType === "Food" ? "Food" : "Non-Food",
            contactNumber:
              item.vendor.vendorAddress[0]?.contactNumber ?? "No contact",
            pickupAddress:
              item.vendor.vendorAddress[0]?.address ?? "Unknown pickup",
            totalWeightKg: 0,
            itemCount: 0,
          };
        }

        // ✅ Use helper for weight conversion
        const weightKg = convertToKg(
          item.product.weight ?? 0,
          item.product.weightUnit
        );

        acc[item.vendorId].totalWeightKg += weightKg * item.quantity;
        acc[item.vendorId].itemCount += item.quantity;

        return acc;
      },
      {}
    )
  );

  // ✅ Compute totals
  const totalWeightKg = vendorGroups.reduce(
    (sum, v) => sum + v.totalWeightKg,
    0
  );
  const totalDeliveryFee = data.deliveryFee ?? 0;

  return (
    <div className="overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-primary p-5 pb-6 shrink-0">
        <Link href="/dashboard">
          <ArrowLeft className="size-6 text-white" />
        </Link>
        <h3 className="text-lg font-bold text-white mt-4">Pick up now</h3>
        <p className="mt-1 text-white text-sm">
          {vendorGroups.length} stop{vendorGroups.length > 1 && "s"} •{" "}
          {totalWeightKg.toFixed(2)} kg total
        </p>
        <Badge variant="secondary" className="mt-2 text-xs">
          {data.vehicleType || "Motorcycle"}
        </Badge>
      </div>

      {/* Scrollable content */}
      <div className="px-3">
        <div className="bg-white h-[39vh] p-4 rounded-sm -mt-3 border shadow-sm">
          {/* Pickup stops */}
          <div className="flex max-h-[30vh] overflow-y-auto flex-col gap-2">
            {vendorGroups.map((stop, idx) => (
              <div key={idx}>
                <div className="flex items-start gap-2">
                  <Circle className="size-2.5 fill-primary text-primary mt-[4px]" />
                  <div className="flex-1">
                    <p className="text-xs font-medium line-clamp-1">
                      {stop.pickupAddress}
                    </p>
                    <p className="text-[11px] text-zinc-600 line-clamp-1">
                      {stop.vendorName} •{" "}
                      <span className="capitalize text-[10px] text-zinc-500">
                        {stop.businessType}
                      </span>
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      📞 {stop.contactNumber}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-zinc-700">
                    <p>
                      {stop.itemCount} item{stop.itemCount > 1 && "s"}
                    </p>
                    <p>{stop.totalWeightKg.toFixed(2)} kg</p>
                  </div>
                </div>
                {idx < vendorGroups.length - 1 && (
                  <Separator
                    orientation="vertical"
                    className="data-[orientation=vertical]:h-5 ml-[5px]"
                  />
                )}
              </div>
            ))}

            {vendorGroups.length > 0 && (
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-5 ml-[5px]"
              />
            )}

            {/* Drop-off */}
            <div className="flex items-start gap-2 mt-3">
              <IconMapPinFilled className="size-3 text-primary mt-[2px]" />
              <div>
                <p className="text-xs font-medium line-clamp-1">
                  {`${data.address?.homeAddress ?? ""}, ${
                    data.address?.barangay ?? ""
                  }`}{" "}
                  (Drop-off)
                </p>
                {data.address?.contactNumber && (
                  <p className="text-[10px] text-zinc-500">
                    📞 {data.address.contactNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Remarks */}
          {data.remarks && (
            <div className="flex mt-5 border py-2 px-2 rounded-sm items-start gap-3">
              <IconMessageFilled className="size-5" />
              <p className="text-xs line-clamp-2">{data.remarks}</p>
            </div>
          )}

          {/* Summary */}
          <div className="mt-4 border-t pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Weight:</span>
              <span className="font-semibold">
                {totalWeightKg.toFixed(2)} kg
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Delivery Fee:</span>
              <span className="font-semibold">
                ₱{totalDeliveryFee.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Accept Button */}
      <div className="fixed bottom-18 left-0 w-full z-50">
        <AcceptOrderButton orderId={data.id} riderId={rider.id} />
      </div>
    </div>
  );
};

export default Page;
