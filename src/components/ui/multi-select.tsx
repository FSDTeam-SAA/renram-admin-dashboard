"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type MultiSelectProps = {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  listClassName?: string;
};

function toggleValue(values: string[], option: string) {
  if (values.includes(option)) {
    return values.filter((value) => value !== option);
  }
  return [...values, option];
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled = false,
  className,
  triggerClassName,
  listClassName,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  const displayValue =
    value.length > 0 ? value.join(", ") : placeholder;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60",
          triggerClassName,
        )}
      >
        <span
          className={cn(
            "block truncate text-left",
            value.length === 0 && "text-gray-400",
          )}
        >
          {displayValue}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && !disabled && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-md"
        >
          <div className={cn("max-h-56 overflow-y-auto p-1", listClassName)}>
            {options.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                No options found
              </div>
            ) : (
              options.map((option) => {
                const selected = value.includes(option);
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => onChange(toggleValue(value, option))}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100",
                      selected && "bg-blue-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-gray-300",
                        selected && "border-blue-600 bg-blue-600",
                      )}
                    >
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <span className="text-left">{option}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
