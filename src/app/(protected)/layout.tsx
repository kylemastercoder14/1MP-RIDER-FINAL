import React from "react";
import { TabBar } from "@/components/layouts/tab-bar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <TabBar />
    </div>
  );
};

export default ProtectedLayout;
