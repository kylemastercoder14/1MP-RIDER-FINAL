"use client";

import { useState, useRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Toast, ToastType } from "./toast-notification";
import { updateOrderStatus } from "@/actions";

export default function PickupOrderButton({
  orderId,
  riderId,
}: {
  orderId: string;
  riderId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pickedUp, setPickedUp] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  const handlePickup = async () => {
    if (loading || pickedUp) return;
    setLoading(true);

    const res = await updateOrderStatus(orderId, "Out For Delivery", riderId); // update your DB here
    setLoading(false);

    if (res.success) {
      setPickedUp(true);
      setToast({ message: res.message || "Order picked up successfully", type: "success" });
      router.push(`/history/${orderId}/order-completed`);
    } else {
      setToast({ message: res.message || "Failed to update order", type: "error" });
    }
  };

  // handle drag logic
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (pickedUp) return;
    setDragging(true);
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragging || pickedUp) return;
    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    if (startX.current !== null) {
      const diff = currentX - startX.current;
      if (diff > 0) setDragX(diff);
    }
  };

  const handleDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const trackWidth = trackRef.current?.offsetWidth || 0;
    const requiredSwipe = Math.min(trackWidth * 0.4, 120);
    if (dragX > requiredSwipe) {
      setDragX(trackWidth - 56);
      handlePickup();
    } else {
      setDragX(0);
    }
  };

  return (
    <div className="bg-primary/5 border-t-6 border-b-6 border-primary p-5 select-none">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center gap-3">
        <div>
          <h3 className="font-semibold">Pick up the order</h3>
          <p className="text-zinc-500 text-sm">
            Swipe to confirm pickup and start delivery.
          </p>
        </div>
      </div>

      <div className="relative mt-4">
        <div
          ref={trackRef}
          className="relative w-full h-14 bg-primary/20 rounded-full overflow-hidden border-2 border-primary cursor-pointer"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleDragStart}
          onMouseMove={(e) => dragging && handleDragMove(e)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out rounded-full ${
              pickedUp ? "bg-primary/40" : "bg-primary/20"
            }`}
            style={{
              width: pickedUp
                ? "100%"
                : `${Math.min(
                    (dragX / (trackRef.current?.offsetWidth || 1)) * 100,
                    100
                  )}%`,
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center text-primary font-medium">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : pickedUp ? (
              "Picked Up"
            ) : (
              "Slide to Pick Up Order"
            )}
          </div>

          <div
            className="absolute top-1 left-1 size-11 flex items-center justify-center bg-white rounded-full shadow-md transition-transform duration-300 ease-out"
            style={{
              transform: pickedUp
                ? "translateX(calc(100% - 3.5rem))"
                : `translateX(${Math.min(
                    dragX,
                    (trackRef.current?.offsetWidth || 0) - 56
                  )}px)`,
            }}
          >
            <ArrowRight className="text-primary size-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
