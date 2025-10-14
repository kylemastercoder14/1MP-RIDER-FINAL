"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Rider } from "@prisma/client";
import { maskEmail } from "@/lib/utils";
import { sendOtp, signOut, verifyOtp } from "@/actions";
import AlertModal from "@/components/ui/alert-modal";
import { Toast, ToastType } from "@/components/toast-notification";
import { ArrowLeft, LogOut } from "lucide-react";

const OTPForm = ({ rider }: { rider: Rider }) => {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isOpen, setIsOpen] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // countdown logic
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // resend OTP handler
  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      setCountdown(60);

      const response = await sendOtp(rider.email, rider.password); // reuse your sendOtp action
      if (response.error) {
        setToast({ message: response.error, type: "error" });
      } else {
        setToast({
          message: "A new OTP has been sent to your email.",
          type: "success",
        });
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await verifyOtp(otp);
      if (response.error) {
        setToast({ message: response.error, type: "error" });
        return;
      }

      setToast({
        message: response.success || "OTP verified successfully",
        type: "success",
      });

      router.push("/onboarding");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    await signOut();
    setToast({ message: "Logout successfully", type: "success" });
    router.push("/sign-up");
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleCancel}
        title="Logout confirmation"
        description="Are you sure you want to logout? This action cannot be undone."
      />
      <div className="flex border-b px-3 py-2 w-full items-center">
        <Link href="/sign-up">
          <ArrowLeft className="size-6" />
        </Link>
        <span className="text-center mx-auto font-semibold">Registration</span>
        <Button
          variant="ghost"
          className="!p-0"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <LogOut className="size-6 text-primary" />
        </Button>
      </div>
      <div className="px-3 mt-4 flex flex-col">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={3000}
            onClose={() => setToast(null)}
          />
        )}
        <h3 className="mb-1 text-xl font-bold tracking-tight">
          Verify your email address
        </h3>
        <span className="tracking-tight text-sm mb-5 font-medium text-muted-foreground">
          Enter the 6-digit code sent via email address at{" "}
          <span className="font-semibold text-black">
            {maskEmail(rider.email)}
          </span>
        </span>
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          disabled={loading}
        >
          <InputOTPGroup className="space-x-1">
            <InputOTPSlot index={0} className="rounded-sm border-l" />
            <InputOTPSlot index={1} className="rounded-sm border-l" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup className="space-x-1">
            <InputOTPSlot index={2} className="rounded-sm border-l" />
            <InputOTPSlot index={3} className="rounded-sm border-l" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup className="space-x-1">
            <InputOTPSlot index={4} className="rounded-sm border-l" />
            <InputOTPSlot index={5} className="rounded-sm border-l" />
          </InputOTPGroup>
        </InputOTP>
        <div className="flex items-center mt-3 text-sm tracking-tight text-muted-foreground gap-1">
          <span>
            {countdown > 0 ? "Resend available in" : "Code not sent?"}
          </span>
          {countdown > 0 ? (
            <span className="text-primary font-semibold">{countdown}s</span>
          ) : (
            <span
              onClick={!isResending ? handleResendOtp : undefined}
              className={`text-primary font-semibold cursor-pointer ${
                isResending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Resend OTP code
            </span>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          onClick={handleSubmit}
          disabled={loading || otp.length !== 6}
          className="mt-5 mb-3"
        >
          Continue
        </Button>
        <div className="flex mt-3 justify-center text-muted-foreground text-sm font-medium items-center gap-1">
          <span>Not a driver? Shop at </span>
          <Link
            href="https://onemarketphilippines.com"
            className="text-primary underline font-semibold"
          >
            1 Market Philippines
          </Link>
        </div>
      </div>
    </>
  );
};

export default OTPForm;
