import React from "react";
import TabHeader from "@/components/layouts/tab-header";
import { useRider } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import OrderList from "@/components/order-list";
import { TabBar } from "@/components/layouts/tab-bar";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { rider } = await useRider();

  if (!rider) redirect("/sign-in");

  return (
    <>
      <div className="px-4 pt-5">
        <TabHeader rider={rider} />
        <OrderList rider={rider} />
      </div>
      <TabBar />
    </>
  );
};

export default Page;
