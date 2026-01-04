import { cloneElement } from "react";

function Input({ className, icon, label, ...props }) {
  const iconWithStyle = cloneElement(icon, {
    className:
      "text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2",
  });

  return (
    <div>
      <label className="text-foreground text-sm font-bold">{label}</label>
      <div className="relative">
        {iconWithStyle}

        <input
          className={`${className} border-input text-foreground bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mt-3 flex h-12 w-full rounded-md border px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
          {...props}
        />
      </div>
    </div>
  );
}

export default Input;
