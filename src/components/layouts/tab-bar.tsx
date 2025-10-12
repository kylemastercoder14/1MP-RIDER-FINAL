import React from "react";
import { FloatingDock } from "@/components/floating-dock";
import {
  IconFileText,
  IconHelpCircle,
  IconUser,
  IconWallet,
} from "@tabler/icons-react";

export function TabBar() {
  const links = [
    {
      title: "History",
      icon: (
        <IconFileText className="h-full w-full" />
      ),
      href: "/history",
    },
    {
      title: "Wallet",
      icon: (
        <IconWallet className="h-full w-full" />
      ),
      href: "/wallet",
    },
    {
      title: "Home",
      icon: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          width={20}
          height={20}
          alt="1 Market Philippines Logo"
        />
      ),
      href: "/dashboard",
    },
    {
      title: "FAQs",
      icon: (
        <IconHelpCircle className="h-full w-full" />
      ),
      href: "/faqs",
    },

    {
      title: "Profile",
      icon: (
        <IconUser className="h-full w-full" />
      ),
      href: "/profile",
    },
  ];
  return (
    <FloatingDock items={links} />
  );
}
