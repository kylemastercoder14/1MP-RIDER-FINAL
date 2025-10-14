"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { acceptOrder } from "@/actions";
import { useRouter } from "next/navigation";
import { Toast, ToastType } from "./toast-notification";

export default function AcceptOrderButton({
  orderId,
  riderId,
}: {
  orderId: string;
  riderId: string;
}) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !accepted && !expired) {
      const timer = setTimeout(() => setCountdown((p) => p - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !accepted) {
      setExpired(true);
      router.push("/dashboard")
    }
  }, [countdown, router, accepted, expired]);

  // Accept action
  const handleAccept = async () => {
    if (expired || accepted || loading) return;
    setLoading(true);
    const res = await acceptOrder(orderId, riderId);
    setLoading(false);

    if (res.success) {
      setAccepted(true);
      setToast({ message: res.message || "Order accepted", type: "success" });
      router.push(`/history/${orderId}/order-accepted`);
    } else {
      setToast({
        message: res.message || "Order already taken.",
        type: "error",
      });
      setExpired(true);
    }
  };

  // Handle swipe gesture
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (expired || accepted) return;
    setDragging(true);
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragging || expired || accepted) return;
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
    const requiredSwipe = Math.min(trackWidth * 0.4, 120); // threshold
    if (dragX > requiredSwipe) {
      // Move handle fully to the right before accepting
      setDragX(trackWidth - 56); // button width offset
      handleAccept();
    } else {
      setDragX(0); // reset if not enough swipe
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
      {/* Header info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border-primary/40 w-13 h-12 text-primary font-semibold text-lg justify-center rounded-full border">
          {expired ? "0s" : `${countdown}s`}
        </div>
        <div>
          <h3 className="font-semibold">Let&apos;s start!</h3>
          <p className="text-zinc-500 text-sm">
            {expired
              ? "Time’s up! Another rider may take this order."
              : "Swipe to accept before time runs out!"}
          </p>
        </div>
      </div>

      {/* Swipe track */}
      <div className="relative mt-4">
        <div
          ref={trackRef}
          className={`relative w-full h-14 bg-primary/20 rounded-full overflow-hidden border-2 border-primary cursor-pointer`}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleDragStart}
          onMouseMove={(e) => dragging && handleDragMove(e)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {/* Progress background */}
          <div
            className={`absolute top-0 left-0 h-full bg-primary/20 transition-all duration-300 ease-out rounded-full ${
              expired ? "bg-primary/20" : ""
            }`}
            style={{
              width: accepted ? "100%" : undefined
            }}
          />

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center text-primary font-medium">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : accepted ? (
              "Order Accepted"
            ) : expired ? (
              "Expired"
            ) : (
              "Swipe to Accept"
            )}
          </div>

          {/* Draggable handle */}
          <div
            className={`absolute top-1 left-1 size-11 flex items-center justify-center bg-white rounded-full shadow-md transition-transform duration-300 ease-out`}
            style={{
              transform: accepted
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
