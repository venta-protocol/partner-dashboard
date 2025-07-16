export default function GrowWithVenta() {
  const features = [
    {
      title: "🧩 White-Labeled Checkout",
      description:
        "Let merchants accept stablecoin payments under your brand. Your logo appears on SolanaPay QR codes, boosting visibility at every checkout.",
    },
    {
      title: "⚡ Blazing-Fast Payments",
      description:
        "Abstracted Web3 stack + real-time WebSocket updates = instant confirmation and smooth UX — no blockchain knowledge needed.",
    },
    {
      title: "🔐 Non-Custodial Payouts",
      description:
        "Funds go straight to the merchant's wallet, accessible via social login — instant, secure, and under their control.",
    },
    {
      title: "📊 Self-Managed Rewards",
      description:
        "Give merchants access to a full dashboard to manage rewards and campaigns — no extra support or integrations needed from your side.",
    },
  ];

  return (
    <section className="relative py-16 px-6" id="growth">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#1e1b4b] -z-10" />
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Grow With Venta</h2>
        <p className="text-lg mb-12 text-slate-300">
          Venta is more than a payments layer — it&apos;s a fully packaged,
          revenue-sharing, plug-and-play stablecoin module that your merchants
          will love.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/40 rounded-lg p-6 shadow hover:shadow-lg transition backdrop-blur border border-slate-500/70"
            >
              <h3 className="text-xl font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
