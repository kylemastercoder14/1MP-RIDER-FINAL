import { Bell, Settings2 } from "lucide-react";
import React from "react";

const TabHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 border px-2 py-1 rounded-full border-primary">
        <p className="text-primary text-xs">On Duty</p>
        <div className="bg-primary size-1.5 rounded-full" />
      </div>
      <div className='flex items-center gap-5'>
        <div className="relative">
          <Bell className="size-4" />
          <div className="absolute -top-1 -right-1 bg-primary size-1.5 rounded-full"></div>
        </div>
        <div className="relative">
          <Settings2 className="size-4" />
          <div className="absolute -top-1 -right-1 bg-primary size-1.5 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default TabHeader;
