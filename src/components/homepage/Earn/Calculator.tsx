"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import UpsideCard from "./UpsideCard";

export default function Calculator() {
  const [volume, setVolume] = useState(1_000_000); // total GMV across merchants
  const [partnerFee, setPartnerFee] = useState(0.003); // 0.3%

  const partnerRevenueMonthly = volume * partnerFee;
  const partnerRevenueAnnual = partnerRevenueMonthly * 12;

  return (
    <section id="savings" className="relative py-16 px-6">
      <div className="absolute inset-0 bg-[#0a122b] -z-10" />
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Earn More with Every Transaction
        </h2>
        <p className="text-lg mb-10 text-slate-200">
          Use the sliders to estimate how much you can earn by adding a small
          fee on top
        </p>

        {/* Volume Slider */}
        <label className="font-medium block mb-4 text-white">
          Total Monthly Volume:{" "}
          <span className="text-indigo-200 font-semibold">
            ${volume.toLocaleString()}
          </span>
        </label>
        <input
          type="range"
          min={100_000}
          max={10_000_000}
          step={10_000}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full max-w-xl mx-auto mb-8 accent-indigo-300"
        />

        {/* Partner Fee Slider */}
        <label className="font-medium block mb-4 text-white">
          Partner Fee (%):{" "}
          <span className="text-indigo-200 font-semibold">
            {(partnerFee * 100).toFixed(1)}%
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={0.02}
          step={0.0005}
          value={partnerFee}
          onChange={(e) => setPartnerFee(Number(e.target.value))}
          className="w-full max-w-xl mx-auto accent-indigo-300"
        />

        <p className="text-sm text-slate-300 mt-4">
          Stripe and other processors charge up to 3%. Venta lets you control
          the margin and own the upside.
        </p>

        {/* Top Row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <UpsideCard
            label="Total Monthly Volume"
            desc="GMV across all your merchants"
            value={volume}
          />
          <UpsideCard
            label="Your Monthly Revenue"
            desc={`${(partnerFee * 100).toFixed(1)}% fee share`}
            value={partnerRevenueMonthly}
          />

          <UpsideCard
            label="Your Annual Revenue"
            desc={`≈ $${Math.round(
              partnerRevenueMonthly
            ).toLocaleString()} / mo`}
            value={partnerRevenueAnnual}
            highlight
          />
        </motion.div>
      </div>
    </section>
  );
}
