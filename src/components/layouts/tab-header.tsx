"use client";
import { Rider } from "@prisma/client";
import { Bell, Settings2 } from "lucide-react";
import React, { useState } from "react";
import { toggleOnDuty } from "@/actions";
import { useRouter } from "next/navigation";

const TabHeader = ({ rider }: { rider: Rider }) => {
  const router = useRouter();
  const [onDuty, setOnDuty] = useState(rider.onDuty);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const updated = await toggleOnDuty(rider.id);
      setOnDuty(updated.onDuty);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between">
      {/* On Duty / Offline Badge */}
      <div
        onClick={handleToggle}
        className={`flex cursor-pointer items-center gap-1 border px-2 py-1 rounded-full ${
          onDuty ? "border-primary" : "border-zinc-500"
        }`}
      >
        {onDuty ? (
          <>
            <p className="text-primary text-xs">
              {loading ? "..." : "On Duty"}
            </p>
            <div className="bg-primary size-1.5 rounded-full" />
          </>
        ) : (
          <>
            <div className="bg-zinc-500 size-1.5 rounded-full" />
            <p className="text-zinc-500 text-xs">
              {loading ? "..." : "Offline"}
            </p>
          </>
        )}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-5">
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
