"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CustomizedInput from "@/components/customized-input";
import { Toast, ToastType } from "@/components/toast-notification";
import { sendOtp } from "@/actions";

const SignUpForm = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await sendOtp(email, password);
      if (response.error) {
        setToast({ message: response.error, type: "error" });
        return;
      }

      setToast({
        message: response.success || "Registered successfully",
        type: "success",
      });
      router.push("/otp");
    } catch (error) {
      console.error(error);
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="px-5 pb-5 mt-2 flex flex-col">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
      <h3 className="mb-3 text-2xl font-bold tracking-tight">
        Register to drive with 1 Market Philippines
      </h3>
      <div className="space-y-4 mt-2 mb-2">
        <CustomizedInput
          type="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <div className="relative">
          <CustomizedInput
            type={passwordVisible ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
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
      <span className="tracking-tight text-sm mt-1 mb-3 font-medium text-muted-foreground">
        We&apos;ll send you an OTP to confirm your email address
      </span>
      <div className="flex mt-3 items-start gap-3">
        <Checkbox
          checked={terms}
          onCheckedChange={(checked) => setTerms(checked === true)}
        />
        <div className="grid tracking-tight gap-1">
          <Label>Accept terms and conditions</Label>
          <p className="text-muted-foreground text-sm">
            By proceeding, you&apos;ve read the full content and agreed to the{" "}
            <Link href="#" className="text-primary">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
      <Button
        type="submit"
        size="lg"
        onClick={handleSubmit}
        disabled={loading || !email || !password || !terms}
        className="mt-5 mb-3"
      >
        Get started as a driver
      </Button>
      <Button
        type="button"
        size="lg"
        onClick={() => router.push("/sign-in")}
        variant="outline"
      >
        Login
      </Button>
      <div className="flex mt-5 justify-center text-muted-foreground text-sm font-medium items-center gap-1">
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

export default SignUpForm;
