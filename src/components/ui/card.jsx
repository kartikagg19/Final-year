import React from "react";

export function Card({ className = "", children }) {
  return (
    <div className={"glass-card " + className}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={"p-6 pb-3 " + className}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h2 className={"text-xl font-display font-semibold text-slate-800 dark:text-slate-100 " + className}>{children}</h2>;
}

export function CardContent({ children, className = "" }) {
  return <div className={"px-6 pb-6 pt-2 " + className}>{children}</div>;
}
