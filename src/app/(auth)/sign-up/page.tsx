
import Image from "next/image";
import React from "react";
import SignUpForm from '@/components/forms/sign-up';

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
	  <SignUpForm />
	</div>
  );
};

export default Page;
