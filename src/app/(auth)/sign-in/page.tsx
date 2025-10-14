import Image from "next/image";
import React from "react";
import SignInForm from "@/components/forms/sign-in";

const Page = () => {
  return (
    <div className="min-h-screen w-full">
      <div className="relative w-full h-[45vh]">
        <Image
          src="/auth.png"
          alt="1 Market Philippines Rider"
          fill
          className="object-contain size-full"
        />
      </div>
      <SignInForm />
    </div>
  );
};

export default Page;
