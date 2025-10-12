import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  IconCoins,
  IconMapPinFilled,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";

const Page = () => {
  return (
    <div>
      {/* Tabs */}
      <div className="w-full max-w-full">
        <Tabs defaultValue="ongoing" className="gap-4 w-full max-w-full py-2">
          <TabsList className="bg-background rounded-none border-b p-0 w-full">
            <TabsTrigger
              value="ongoing"
              className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
            >
              Ongoing
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="canceled"
              className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
            >
              Canceled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ongoing">
            <div className="flex h-[60vh] items-center justify-center flex-col">
              <Image src="/empty.svg" alt="Empty" width={100} height={100} />
              <p className="mt-3 text-zinc-500">No orders yet</p>
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="space-y-6 px-3 h-[80vh] overflow-y-auto hide-scrollbar pb-22">
              <div className="active:bg-black/5">
                <div className="p-3 bg-primary flex items-center justify-between text-white">
                  <p className="font-medium text-sm">Completed</p>
                  <p className="font-medium text-sm">Oct 10 2025 - 7:15PM</p>
                </div>
                <div className="p-3 border shadow rounded-bl-sm rounded-br-sm">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-zinc-200">
                      Motorcycle
                    </Badge>
                    <div className="flex items-center gap-0.5">
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStarFilled className="text-yellow-500 size-4" />
                    </div>
                  </div>
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
                <div className="p-3 bg-primary flex items-center justify-between text-white">
                  <p className="font-medium text-sm">Completed</p>
                  <p className="font-medium text-sm">Oct 9 2025 - 6:20AM</p>
                </div>
                <div className="p-3 border shadow rounded-bl-sm rounded-br-sm">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-zinc-200">
                      Motorcycle
                    </Badge>
                    <div className="flex items-center gap-0.5">
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStarHalfFilled className="text-yellow-500 size-4" />
                    </div>
                  </div>
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
                <div className="p-3 bg-primary flex items-center justify-between text-white">
                  <p className="font-medium text-sm">Completed</p>
                  <p className="font-medium text-sm">Oct 9 2025 - 6:20AM</p>
                </div>
                <div className="p-3 border shadow rounded-bl-sm rounded-br-sm">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-zinc-200">
                      Motorcycle
                    </Badge>
                    <div className="flex items-center gap-0.5">
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStarFilled className="text-yellow-500 size-4" />
                      <IconStar className="text-yellow-500 size-4" />
                    </div>
                  </div>
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
          </TabsContent>
          <TabsContent value="canceled">
            <div className="space-y-6 px-3 h-[80vh] overflow-y-auto hide-scrollbar pb-22">
              <div className="active:bg-black/5">
                <div className="p-3 bg-primary flex items-center justify-between text-white">
                  <p className="font-medium text-sm">Customer Canceled</p>
                  <p className="font-medium text-sm">Oct 10 2025 - 7:15PM</p>
                </div>
                <div className="p-3 border shadow rounded-bl-sm rounded-br-sm">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-zinc-200">
                      Motorcycle
                    </Badge>
                    <div className="flex text-sm font-medium items-center gap-0.5">
                      Change of Mind
                    </div>
                  </div>
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
                </div>
              </div>
              <div className="active:bg-black/5">
                <div className="p-3 bg-primary flex items-center justify-between text-white">
                  <p className="font-medium text-sm">Driver Canceled</p>
                  <p className="font-medium text-sm">Oct 9 2025 - 6:20AM</p>
                </div>
                <div className="p-3 border shadow rounded-bl-sm rounded-br-sm">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-zinc-200">
                      Motorcycle
                    </Badge>
                    <div className="flex text-sm font-medium items-center gap-0.5">
                      Out of Gas
                    </div>
                  </div>
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
                </div>
              </div>
              <div className="active:bg-black/5">
                <div className="p-3 bg-primary flex items-center justify-between text-white">
                  <p className="font-medium text-sm">Customer Canceled</p>
                  <p className="font-medium text-sm">Oct 9 2025 - 6:20AM</p>
                </div>
                <div className="p-3 border shadow rounded-bl-sm rounded-br-sm">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-zinc-200">
                      Motorcycle
                    </Badge>
                    <div className="flex text-sm font-medium items-center gap-0.5">
                      Change of Mind
                    </div>
                  </div>
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
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
