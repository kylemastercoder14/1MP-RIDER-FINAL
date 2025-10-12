import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import OTPForm from '@/components/forms/otp';

const Page = () => {
  return (
    <div className="min-h-screen">
      <div className="flex border-b px-3 py-4 w-full items-center">
        <Link href="/sign-up">
          <ArrowLeft className="size-6" />
        </Link>
		<span className='text-center mx-auto font-semibold'>Registration</span>
      </div>
	  <OTPForm />
    </div>
  );
};

export default Page;
