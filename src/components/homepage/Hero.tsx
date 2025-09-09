"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TypeAnimation } from "react-type-animation";

export default function Hero() {
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash === "#savings") {
        e.preventDefault();
        const el = document.querySelector(target.hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    const anchors = document.querySelectorAll('a[href="#savings"]');
    anchors.forEach((a) =>
      a.addEventListener("click", handleSmoothScroll as EventListener)
    );

    return () => {
      anchors.forEach((a) =>
        a.removeEventListener("click", handleSmoothScroll as EventListener)
      );
    };
  }, []);

  return (
    <section className="flex flex-col justify-center items-center text-center px-6 pt-48 pb-16 relative">
      <div className="absolute inset-0 bg-[#0a122b] -z-10" />
      <div className="max-w-6xl mx-auto items-center gap-12">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
            Stablecoin Payments API
          </h1>
          <div className="mt-2 text-2xl md:text-4xl font-semibold max-w-2xl md:max-w-3xl mx-auto">
            Powering{" "}
            <TypeAnimation
              sequence={[
                "POS Systems",
                2000,
                "Merchant Solutions",
                2000,
                "Payment Providers",
                2000,
                "Retail Platforms",
                2000,
                "E-commerce Systems",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="bg-gradient-to-r from-indigo-500 to-sky-400 text-transparent bg-clip-text inline-block"
            />
          </div>

          <p className="text-lg mt-6 max-w-2xl text-slate-300">
            Accept stablecoins with low fees, instant settlement, and no new
            hardware.
            <br />
            You can add your own markup (e.g. 0.3%) that goes straight to you.
            <br />
            It&apos;s a new, recurring revenue stream baked right into your POS.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-center gap-4">
            <Link
              href="https://form.typeform.com/to/r95X54XV"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-indigo-600 hover:bg-indigo-500 px-6 py-3 font-medium text-white transition"
            >
              Contact Us
            </Link>

            <a
              href="https://venta.gitbook.io/venta"
              className="inline-block rounded-lg border border-white/20 px-6 py-3 font-medium text-white hover:bg-white/10 transition"
            >
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
