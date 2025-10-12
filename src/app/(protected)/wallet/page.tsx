import {
  BanknoteArrowDown,
  ChevronRight,
  CreditCard,
  FileText,
  IdCard,
  Wallet,
} from "lucide-react";
import React from "react";

const Page = () => {
  return (
    <div>
      <h3 className="text-center mt-4 font-semibold">Wallet</h3>
      <div className="bg-primary p-5 mt-3">
        <p className="text-white text-sm">Balance</p>
        <h3 className="text-white mt-2 text-3xl font-medium">₱1,040.56</h3>
        <div className="mt-16">
          <p className="text-white text-sm">Deposit</p>
          <h3 className="text-white mt-1 text-lg font-medium">₱300.00</h3>
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
    </div>
  );
};

export default Page;
