"use client";

import React, { useId } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CustomizedInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode; // 👈 Accept a right-side element (like icon or button)
};

export default function CustomizedInput({
  label,
  type = "text",
  placeholder = " ",
  rightSlot,
  leftSlot,
  ...props
}: CustomizedInputProps) {
  const id = useId();

  return (
    <div className="group relative w-full">
      <label
        htmlFor={id}
        className={cn(`origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground transition-all
          group-focus-within:pointer-events-none
          group-focus-within:top-0 group-focus-within:cursor-default
          group-focus-within:text-xs group-focus-within:font-medium
          group-focus-within:text-primary
          has-[+input:not(:placeholder-shown)]:pointer-events-none
          has-[+input:not(:placeholder-shown)]:top-0
          has-[+input:not(:placeholder-shown)]:cursor-default
          has-[+input:not(:placeholder-shown)]:text-xs
          has-[+input:not(:placeholder-shown)]:font-medium
          has-[+input:not(:placeholder-shown)]:text-primary`, leftSlot && "pl-10 group-focus-within:pl-1")}
      >
        <span className="bg-background inline-flex px-2">{label}</span>
      </label>

      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn(rightSlot && "pr-10", leftSlot && "pl-10")}
        {...props}
      />

      {rightSlot && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {rightSlot}
        </div>
      )}

      {leftSlot && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-sm peer-disabled:opacity-50">
          {leftSlot}
        </span>
      )}
    </div>
  );
}
