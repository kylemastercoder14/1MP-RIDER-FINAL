
import React from "react";
import OnboardingForm from "@/components/forms/onboarding";
import { useRider } from "@/hooks/use-user";
import { redirect } from "next/navigation";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { rider } = await useRider();
  if (!rider) {
    redirect("/sign-up");
  }
  return (
    <div className="min-h-screen">
      <OnboardingForm rider={rider} />
    </div>
  );
};

export default Page;
