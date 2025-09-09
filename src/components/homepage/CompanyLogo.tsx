import Image from "next/image";

const logos = [
  {
    href: "https://www.solana.com/",
    src: "/images/logos/solana-01.svg",
    alt: "Solana",
  },
  {
    href: "https://solana.com/breakpoint",
    src: "/images/logos/breakpoint2024.svg",
    alt: "Solana Breakpoint",
  },
  {
    href: "https://solanasummit.org",
    src: "/images/logos/solanasummit.svg",
    alt: "Solana Summit",
  },
  {
    href: "https://x.com/hackerhouses",
    src: "/images/logos/hackerhouse-01.svg",
    alt: "Solana Hacker Houses",
  },
  {
    href: "https://www.proofoftalk.io/",
    src: "/images/logos/proofoftalk.svg",
    alt: "Proof of Talk",
  },
  {
    href: "https://www.forma.city/",
    src: "/images/logos/forma.svg",
    alt: "Forma City",
  },
  {
    href: "https://www.raposacoffee.com/",
    src: "/images/logos/raposa-01.svg",
    alt: "Raposa Coffee",
  },
  {
    href: "https://www.okx.com/web3",
    src: "/images/logos/okx.svg",
    alt: "Okx Wallet",
  },
  {
    href: "https://www.selecta.com/int/en",
    src: "/images/logos/selecta.png",
    alt: "Selecta",
  },
  {
    href: "https://www.decaf.so",
    src: "/images/logos/decaf.png",
    alt: "Decaf",
  },
  {
    href: "https://globaldollar.com/",
    src: "/images/logos/gdn.svg",
    alt: "Global Dollar Network",
  },
  {
    href: "https://solana.com/playgg",
    src: "/images/logos/playgg.png",
    alt: "Solana PlayGG",
  },
];

export default function CompanyLogo() {
  return (
    <section className="relative py-16 px-6">
      <div className="absolute inset-0 bg-[#0a122b] -z-10" />
      <div className="container mx-auto text-center">
        <h3 className="text-3xl font-semibold mb-12 text-slate-300">
          Trusted by industry leaders and innovators
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-center">
          {logos.map((logo) => (
            <a
              key={logo.alt}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                logo.alt === "Global Dollar Network"
                  ? "relative h-10 grayscale opacity-30 hover:opacity-70 transition"
                  : "relative h-10 grayscale opacity-40 hover:opacity-100 transition"
              }
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                style={{ objectFit: "contain" }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
