"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomizedInput from "@/components/customized-input";

const SignInForm = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  return (
    <div className="px-5 mt-3 flex flex-col">
      <div className="space-y-4 mb-2">
        <CustomizedInput
          type="email"
          label="Email address"
          // value={email}
          onChange={(e) => console.log(e.target.value)}
        />
        <div className="relative">
          <CustomizedInput
            type={passwordVisible ? "text" : "password"}
            label="Password"
            // value={email}
            onChange={(e) => console.log(e.target.value)}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {passwordVisible ? (
              <EyeOff className="text-muted-foreground size-4" />
            ) : (
              <Eye className="text-muted-foreground size-4" />
            )}
          </button>
        </div>
      </div>
      <Link
        className="font-semibold mt-2 text-sm text-[#800020]"
        href="/forgot-password"
      >
        Forgot password?
      </Link>
      <Button type="submit" size="lg" disabled className="mt-5 mb-3">
        Log in
      </Button>
      <Button
        type="button"
        size="lg"
        onClick={() => router.push("/sign-up")}
        variant="outline"
      >
        Register
      </Button>
      <div className="flex mt-5 justify-center text-muted-foreground text-sm font-medium items-center gap-2">
        <Link href="/forgot-password">Terms & Conditions</Link>
        <span>•</span>
        <Link href="/forgot-password">Privacy Policy</Link>
      </div>
    </div>
  );
};

export default SignInForm;
