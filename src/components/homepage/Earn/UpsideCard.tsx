import React from "react";

export default function UpsideCard({
  label,
  desc,
  value,
  highlight = false,
}: {
  label: string;
  desc: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-6 shadow-sm text-center backdrop-blur transition-all duration-300 ${
        highlight
          ? "bg-slate-800/80 border-2 border-indigo-400/30 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"
          : "bg-slate-800/40 border border-slate-700/50"
      }`}
    >
      <p
        className={`text-sm font-medium ${
          highlight ? "text-indigo-200" : "text-slate-300"
        } mb-1`}
      >
        {label}
      </p>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-white" : "text-slate-200"
        }`}
      >
        ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </p>
      <p
        className={`text-xs ${
          highlight ? "text-indigo-200" : "text-slate-400"
        } mt-1`}
      >
        {desc}
      </p>
    </div>
  );
}
