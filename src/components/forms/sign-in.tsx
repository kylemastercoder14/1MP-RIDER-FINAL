"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomizedInput from "@/components/customized-input";
import { signIn } from "@/actions";
import { Toast, ToastType } from "@/components/toast-notification";

const SignInForm = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      const response = await signIn(email, password);

      if (response.error) {
        setToast({ message: response.error, type: "error" });
        return;
      }

      const rider = response.rider;

      if (!rider) {
        setToast({
          message: "Login failed. Please try again.",
          type: "error",
        });
        return;
      }

      // ✅ Redirect based on backend status
      if (rider.adminApproval === "Pending") {
        setToast({
          message: "Please complete your onboarding details.",
          type: "warning",
        });
        router.push("/onboarding");
      } else if (rider.adminApproval === "Under Review") {
        setToast({
          message: "Please wait for admin's approval.",
          type: "warning",
        });
        router.push("/waiting-for-approval");
      } else if (rider.adminApproval === "Rejected") {
        setToast({
          message: "Your application was rejected. Please contact support.",
          type: "error",
        });
      } else {
        setToast({ message: "Login successful!", type: "success" });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 mt-3 flex flex-col">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
      <div className="space-y-4 mb-2">
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
      <Link
        className="font-semibold mt-2 text-sm text-[#800020]"
        href="/forgot-password"
      >
        Forgot password?
      </Link>
      <Button
        onClick={handleSubmit}
        type="submit"
        size="lg"
        disabled={loading || !email || !password}
        className="mt-5 mb-3"
      >
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
