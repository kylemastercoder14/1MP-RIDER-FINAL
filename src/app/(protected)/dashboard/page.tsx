import React from "react";
import TabHeader from "@/components/layouts/tab-header";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { IconCoins, IconMapPinFilled } from "@tabler/icons-react";

const Page = () => {
  return (
    <div className="px-4 pt-5">
      <TabHeader />
      <div>
        <div className="flex items-center gap-3 mt-5">
          <Image src="/motor.png" alt="Motor" width={80} height={80} />
          <div>
            <h3 className="font-medium text-sm">Want to take orders?</h3>
            <p className="text-xs text-zinc-600">
              Maximize earning potential on orders below
            </p>
          </div>
        </div>
        <div className="space-y-5 h-[80vh] overflow-y-auto hide-scrollbar pb-22 mt-7">
          <div className="active:bg-black/5">
            <div className="bg-primary rounded-tl-sm rounded-tr-sm p-3">
              <p className="text-white font-medium">(~3 items) Pick up now</p>
            </div>
            <div className="p-3 border shadow rounded-bl-sm rounded-br-sm">
              <Badge variant="secondary" className="bg-zinc-200">
                Motorcycle
              </Badge>
              <div className="flex flex-col mt-4 gap-1">
                <div className="flex items-center gap-2">
                  <Circle className="size-3 text-primary" />
                  <p className="text-xs font-medium">Pasong Santol</p>
                </div>
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-2.5 ml-[5px]"
                />
                <div className="flex items-center gap-2">
                  <IconMapPinFilled className="size-3 text-primary" />
                  <p className="text-xs font-medium">Ruby St.</p>
                </div>
              </div>
              <p className="text-right text-sm mt-2 font-semibold">
                4 kg total weight
              </p>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <IconCoins className="text-primary size-5" />
                <p className="font-bold">₱50.00</p>
              </div>
            </div>
          </div>
          <div className="active:bg-black/5">
            <div className="bg-primary rounded-tl-sm rounded-tr-sm p-3">
              <p className="text-white font-medium">(~3 items) Pick up now</p>
            </div>
            <div className="p-3 border shadow rounded-bl-sm rounded-br-sm">
              <Badge variant="secondary" className="bg-zinc-200">
                Motorcycle
              </Badge>
              <div className="flex flex-col mt-4 gap-1">
                <div className="flex items-center gap-2">
                  <Circle className="size-3 text-primary" />
                  <p className="text-xs font-medium">Pasong Santol</p>
                </div>
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-2.5 ml-[5px]"
                />
                <div className="flex items-center gap-2">
                  <IconMapPinFilled className="size-3 text-primary" />
                  <p className="text-xs font-medium">Ruby St.</p>
                </div>
              </div>
              <p className="text-right text-sm mt-2 font-semibold">
                4 kg total weight
              </p>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <IconCoins className="text-primary size-5" />
                <p className="font-bold">₱50.00</p>
              </div>
            </div>
          </div>
          <div className="active:bg-black/5">
            <div className="bg-primary rounded-tl-sm rounded-tr-sm p-3">
              <p className="text-white font-medium">(~3 items) Pick up now</p>
            </div>
            <div className="p-3 border shadow rounded-bl-sm rounded-br-sm">
              <Badge variant="secondary" className="bg-zinc-200">
                Motorcycle
              </Badge>
              <div className="flex flex-col mt-4 gap-1">
                <div className="flex items-center gap-2">
                  <Circle className="size-3 text-primary" />
                  <p className="text-xs font-medium">Pasong Santol</p>
                </div>
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-2.5 ml-[5px]"
                />
                <div className="flex items-center gap-2">
                  <IconMapPinFilled className="size-3 text-primary" />
                  <p className="text-xs font-medium">Ruby St.</p>
                </div>
              </div>
              <p className="text-right text-sm mt-2 font-semibold">
                4 kg total weight
              </p>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <IconCoins className="text-primary size-5" />
                <p className="font-bold">₱50.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
