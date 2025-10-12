"use client"

import { useId } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Option = {
  value: string
  label: string
}

type CustomizedSelectProps = {
  label: string
  options: Option[]
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

export default function CustomizedSelect({
  label,
  options,
  value,
  placeholder = "Select an option",
  onChange,
  disabled = false,
  className = "",
}: CustomizedSelectProps) {
  const id = useId()

  return (
    <div className={`group relative w-full ${className}`}>
      {/* Floating Label */}
      <label
        htmlFor={id}
        className="bg-background text-primary absolute top-0 left-2 z-10 block -translate-y-1/2 px-1 text-xs font-medium
          group-has-[select:disabled]:opacity-50"
      >
        {label}
      </label>

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className="w-full pt-5"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
