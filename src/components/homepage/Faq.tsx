// src/components/Sections/FaqSection.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqData = [
  {
    question: "What is Venta?",
    answer:
      "Venta is a stablecoin payment and rewards API for POS systems. It lets you offer fast, low-fee stablecoin payments to your merchants — with built-in revenue sharing, rewards, and campaign tools.",
  },
  // {
  //   question: "How does Venta make money?",
  //   answer:
  //     "Venta charges a base fee of 0.7% per transaction. As a POS partner, you can add your own markup (e.g. 0.3%), which goes directly to you. No subscriptions or setup fees.",
  // },
  {
    question: "How do I integrate Venta into my POS system?",
    answer:
      "We provide a simple REST and WebSocket-based API. You can embed our payment flow, access real-time updates, and optionally white-label the QR experience — all with full developer support.",
  },
  {
    question: "Does Venta require crypto knowledge?",
    answer:
      "Not at all. We abstract the Web3 components. Merchants log in with social auth, and funds go directly to their wallet — no seed phrases, no technical setup.",
  },
  {
    question: "Is this compatible with our existing POS features?",
    answer:
      "Yes. Venta can run alongside your current setup or be embedded directly. It works as a lightweight add-on that enhances your offering without disrupting your flow.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="relative py-16 px-6" id="faq">
      <div className="absolute inset-0 bg-[#0a122b] -z-10" />
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-white text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-200 text-lg max-w-md">
            Everything you need to know about integrating Venta and unlocking
            new revenue streams.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-700/50 rounded-md bg-slate-800/40 backdrop-blur"
            >
              <button
                onClick={() => setActiveIndex(i === activeIndex ? null : i)}
                className="w-full px-5 py-4 text-left text-white flex justify-between items-center"
              >
                <span className="font-medium text-base">{faq.question}</span>
                <span className="text-indigo-200">
                  {activeIndex === i ? "▲" : "▼"}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {activeIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-4 text-slate-300"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
