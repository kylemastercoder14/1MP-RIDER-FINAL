import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import OnboardingForm from "@/components/forms/onboarding";

const Page = () => {
  return (
    <div className="min-h-screen">
      <div className="flex border-b px-3 py-4 w-full items-center">
        <Link href="/sign-up">
          <ArrowLeft className="size-6" />
        </Link>
        <span className="text-center mx-auto font-semibold">Registration</span>
        <Link href="/sign-in">
          <LogOut className="size-6 text-primary" />
        </Link>
      </div>
      <OnboardingForm />
    </div>
  );
};

export default Page;
