/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { ArrowRight, Camera, Loader2 } from "lucide-react";
import { Toast, ToastType } from "./toast-notification";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions";

export default function OrderDeliveredButton({
  orderId,
  riderId,
}: {
  orderId: string;
  riderId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [proof, setProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 👈 for showing image preview
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  // ✅ Handle proof photo selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProof(file);
      setPreviewUrl(URL.createObjectURL(file)); // 👈 show image preview
      setToast({
        message: "Photo attached as proof of delivery ✅",
        type: "success",
      });
    }
  };

  // ✅ Confirm delivery
  const handleDelivered = async () => {
    if (loading || delivered) return;
    if (!proof) {
      setToast({
        message: "Please attach proof of delivery first",
        type: "error",
      });
      return;
    }

    setLoading(true);
    const res = await updateOrderStatus(orderId, "Delivered", riderId);
    setLoading(false);

    if (res.success) {
      setDelivered(true);
      setToast({
        message: res.message || "Order delivered successfully!",
        type: "success",
      });
      router.push(`/history`);
    } else {
      setToast({
        message: res.message || "Failed to update order",
        type: "error",
      });
    }
  };

  // ✅ Swipe gesture
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (delivered || loading) return;
    setDragging(true);
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragging || delivered || loading) return;
    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    if (startX.current !== null) {
      const diff = currentX - startX.current;
      if (diff > 0) setDragX(diff);
    }
  };

  const handleDragEnd = () => {
    if (!dragging) return;
    setDragging(false);

    // 🚫 block swipe if no photo proof
    if (!proof) {
      setToast({
        message: "You must attach a proof photo before confirming delivery",
        type: "error",
      });
      setDragX(0);
      return;
    }

    const trackWidth = trackRef.current?.offsetWidth || 0;
    const requiredSwipe = Math.min(trackWidth * 0.4, 120);

    if (dragX > requiredSwipe) {
      setDragX(trackWidth - 56);
      handleDelivered();
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Arrived at drop-off</h3>
          <p className="text-zinc-500 text-sm">
            Take a proof of delivery photo, then swipe to confirm.
          </p>
        </div>

        {/* 📸 Camera / 🖼️ Photo Preview */}
        <label className="cursor-pointer flex items-center justify-center h-12 w-16 rounded-full shadow overflow-hidden border-2 border-primary bg-white">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Proof of Delivery"
              className="object-cover w-full h-full"
            />
          ) : (
            <Camera className="size-6 text-primary" />
          )}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Swipe Track */}
      <div className="relative mt-5">
        <div
          ref={trackRef}
          className={`relative w-full h-14 rounded-full overflow-hidden border-2 cursor-pointer transition-colors duration-300 ${
            proof
              ? "bg-primary/20 border-primary"
              : "bg-zinc-200 border-zinc-400"
          }`}
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
              delivered ? "bg-primary/50" : "bg-primary/20"
            }`}
            style={{
              width: delivered
                ? "100%"
                : `${Math.min(
                    (dragX / (trackRef.current?.offsetWidth || 1)) * 100,
                    100
                  )}%`,
            }}
          />

          <div
            className={`absolute inset-0 flex items-center justify-center font-medium ${
              proof ? "text-primary" : "text-zinc-400"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : delivered ? (
              "Order Delivered"
            ) : (
              "Slide to Confirm Delivery"
            )}
          </div>

          <div
            className={`absolute top-1 left-1 size-11 flex items-center justify-center bg-white rounded-full shadow-md transition-transform duration-300 ease-out ${
              !proof && "opacity-50"
            }`}
            style={{
              transform: delivered
                ? "translateX(calc(100% - 3.5rem))"
                : `translateX(${Math.min(
                    dragX,
                    (trackRef.current?.offsetWidth || 0) - 56
                  )}px)`,
            }}
          >
            <ArrowRight
              className={`size-6 ${proof ? "text-primary" : "text-zinc-400"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
