"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OTPForm = () => {
  const router = useRouter();
  return (
    <div className="px-3 mt-2 flex flex-col">
      <h3 className="mb-1 text-xl font-bold tracking-tight">
        Verify your email address
      </h3>
      <span className="tracking-tight text-sm mb-5 font-medium text-muted-foreground">
        Enter the 6-digit code sent via email address at{" "}
        <span className="font-semibold text-black">ky******er14@gmail.com</span>
      </span>
      <InputOTP maxLength={6}>
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
          Code not sent?{" "}
          <span className="text-primary font-semibold cursor-pointer">
            Resend OTP code
          </span>
        </span>
      </div>
      <Button type="submit" size="lg" disabled className="mt-5 mb-3">
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
  );
};

export default OTPForm;
