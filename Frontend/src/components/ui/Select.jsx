import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function Select({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  disabled = false,
  size = "md",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: "text-sm px-3 py-2",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-4 py-3",
  };

  return (
    <div ref={ref} className="relative w-fit min-w-35">
      {/* Trigger */}
      <button
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={` ${sizeClasses[size]} border-border bg-card text-foreground flex w-full items-center justify-between gap-2 rounded-lg border font-bold transition ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-accent"} `}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="border-border bg-popover absolute z-50 mt-2 w-full overflow-hidden rounded-lg border shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`hover:bg-accent text-foreground w-full px-4 py-2 text-left text-sm font-bold ${opt.value === value ? "bg-accent font-medium" : ""} `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Select;
