"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import CustomizedInput from "@/components/customized-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  return !!date && !isNaN(date.getTime());
}

type DatePickerProps = {
  id?: string;
  placeholder?: string;
  defaultDate?: Date;
  value?: Date;
  onChangeAction?: (date: Date | undefined) => void;
  disabled?: boolean;
  label: string;
};

export function DatePicker({
  id = "date",
  label,
  placeholder = "Select a date",
  defaultDate,
  value,
  onChangeAction,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    defaultDate
  );
  const [month, setMonth] = React.useState<Date | undefined>(internalDate);
  const [inputValue, setInputValue] = React.useState(
    formatDate(value || internalDate)
  );

  const selectedDate = value ?? internalDate;

  const handleDateChange = (date: Date | undefined) => {
    if (isValidDate(date)) {
      setInternalDate(date);
      setInputValue(formatDate(date));
      setMonth(date);
      if (onChangeAction) onChangeAction(date);
    }
  };

  return (
    <CustomizedInput
      label={label}
      id={id}
      value={inputValue}
      placeholder={placeholder}
      className="bg-background"
      onChange={(e) => {
        const input = e.target.value;
        const parsed = new Date(input);
        setInputValue(input);
        if (isValidDate(parsed)) {
          handleDateChange(parsed);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
        }
      }}
      disabled={disabled}
      rightSlot={
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 h-6 w-6"
              type="button"
              disabled={disabled}
            >
              <CalendarIcon className="size-4" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                handleDateChange(date);
                setOpen(false);
              }}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      }
    />
  );
}
