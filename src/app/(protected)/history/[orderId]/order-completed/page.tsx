/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import db from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRider } from "@/hooks/use-user";
import { convertToKg } from "@/lib/utils";
import { PhoneCall, ArrowLeft, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IconMapPinFilled, IconMessageFilled } from "@tabler/icons-react";
import OrderDeliveredButton from '@/components/deliver-order';

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

  // ✅ Fetch order with related data
  const data = await db.order.findUnique({
    where: { id: params.orderId },
    include: {
      address: true,
      user: true,
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
        <p className="text-sm text-zinc-600 mt-2">
          The order you're looking for may have been cancelled or removed.
        </p>
      </div>
    );
  }

  // ✅ Group items by vendor and convert all weights to kilograms
  const vendorGroups: VendorGroup[] = Object.values(
    data.orderItem.reduce((acc: Record<string, VendorGroup>, item: any) => {
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

      const weightKg = convertToKg(
        item.product.weight ?? 0,
        item.product.weightUnit
      );

      acc[item.vendorId].totalWeightKg += weightKg * item.quantity;
      acc[item.vendorId].itemCount += item.quantity;

      return acc;
    }, {})
  );

  // ✅ Totals
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
        <h3 className="text-lg font-bold text-white mt-4">
          Arriving at drop-off location
        </h3>
        <p className="mt-1 text-white text-sm">
          {vendorGroups.length} stop{vendorGroups.length > 1 && "s"} •{" "}
          {totalWeightKg.toFixed(2)} kg total
        </p>
        <Badge variant="secondary" className="mt-2 text-xs">
          {data.vehicleType || "Motorcycle"}
        </Badge>
      </div>

      <div className="px-3">
        {/* ✅ Order Summary */}
        <div className="p-4 border bg-white -mt-3 rounded-sm shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">
              Customer:{" "}
              <span className="text-primary">
                {data.user ? `${data.user.firstName}` : "Customer"}
              </span>
            </h2>
            <Link
              className="flex items-center gap-2 text-primary text-sm"
              href={`tel:${data.user.phoneNumber}`}
            >
              <PhoneCall className="size-4 text-primary" />
              Call
            </Link>
          </div>

          <p className="text-sm text-zinc-400 mt-1">
            {data.paymentMethod} •{" "}
            {data.paymentStatus === "Paid" ? "Paid" : "Collect Cash"}
          </p>

          <div className="text-right mb-2">
            <h3 className="text-2xl font-bold text-primary">
              ₱{totalDeliveryFee.toFixed(2)}
            </h3>
          </div>

          <div>
            <p className="text-xs text-zinc-500">
              {new Date(data.createdAt).toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500">#{data.orderNumber}</p>

            <Badge variant="destructive" className="mt-2">
              Priority
            </Badge>

            <div className="bg-zinc-100 p-3 mt-3 rounded-sm border text-sm text-black">
              📦 Proof of delivery required at dropoff.
            </div>

            {/* Pickup stops */}
            <div className="flex max-h-[30vh] mt-5 overflow-y-auto flex-col gap-2">
              {vendorGroups.map((stop, idx) => (
                <div key={idx}>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="size-3 text-primary mt-[2px]" />
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
          </div>
        </div>
      </div>

      {/* Fixed Accept Button */}
      <div className="mt-5">
        <OrderDeliveredButton orderId={data.id} riderId={rider.id} />
      </div>
    </div>
  );
};

export default Page;
