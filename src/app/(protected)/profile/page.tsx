import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  LogOut,
  Medal,
  ShoppingBag,
  Turntable,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import Link from 'next/link';

const Page = () => {
  return (
    <div>
      <div className="flex items-center mt-10 justify-center flex-col">
        <Avatar className="rounded-full size-14">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold mt-3 tracking-tight">
          Kyle Andre Lim
        </h3>
        <div className="flex items-center gap-5 mt-2">
          <div className="flex items-center text-zinc-500 text-sm gap-2">
            <Turntable className="size-4" />
            <p>HBFY37</p>
          </div>
          <span>|</span>
          <div className="flex items-center text-zinc-500 text-sm gap-2">
            <ShoppingBag className="size-4" />
            <p>12 orders</p>
          </div>
        </div>
        <Badge className="text-white mt-2">
          <Medal />
          Excellent
        </Badge>
      </div>
      <div className="mt-6">
        <div className="py-3 border-b border-t pl-5 pr-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm">Account Details</p>
          </div>
          <ChevronRight className="size-4" />
        </div>
        <div className="py-3 border-b pl-5 pr-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm">Vehicle Details</p>
          </div>
          <ChevronRight className="size-4" />
        </div>
        <div className="py-3 border-b pl-5 pr-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm">Income Statistics</p>
          </div>
          <ChevronRight className="size-4" />
        </div>
        <div className="py-3 border-b pl-5 pr-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm">Privacy Policy</p>
          </div>
          <ChevronRight className="size-4" />
        </div>
        <div className="py-3 border-b pl-5 pr-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm">Terms & Conditions</p>
          </div>
          <ChevronRight className="size-4" />
        </div>
        <div className="py-3 border-b pl-5 pr-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm">About</p>
          </div>
          <ChevronRight className="size-4" />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center">
        <Link href="/sign-in" className="flex items-center font-semibold gap-3">
          <LogOut className="text-primary size-4" />
          <p className="text-sm text-primary">Logout</p>
        </Link>
      </div>
	  <div className="mt-10 flex items-center justify-center">
        <div className="flex items-center font-semibold gap-3">
          <Image width={25} height={25} src="/logo.png" alt='1 Market Philippines Logo' />
          <p className="text-sm">1 Market Philippines Driver</p>
        </div>
      </div>
	  <p className='mt-3 text-sm text-zinc-400 text-center'>Version: v1.0.0</p>
    </div>
  );
};

export default Page;
