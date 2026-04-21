import React from "react";

export function Button({ className = "", variant = "primary", size = "md", children, ...props }) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-600 text-white shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5",
    secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
    danger: "bg-rose-500 text-white shadow-lg hover:shadow-rose-500/25 hover:-translate-y-0.5",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
  };

  const sizes = {
    sm: "rounded-xl px-3 py-1.5 text-xs",
    md: "rounded-2xl px-5 py-2.5 text-sm",
    lg: "rounded-[1.25rem] px-8 py-3.5 text-base"
  };

  const finalClass = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  return (
    <button className={finalClass} {...props}>
      {children}
    </button>
  );
}
