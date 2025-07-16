export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-transparent fixed top-0 z-50 backdrop-blur-md">
      <div className="text-xl font-bold text-white">Venta</div>
      <ul className="hidden md:flex gap-6 text-sm font-medium">
        <li>
          <a href="#features" className="hover:text-indigo-400">
            Features
          </a>
        </li>
        <li>
          <a href="#growth" className="hover:text-indigo-400">
            Growth
          </a>
        </li>
        <li>
          <a href="#savings" className="hover:text-indigo-400">
            Savings
          </a>
        </li>
        <li>
          <a href="#faq" className="hover:text-indigo-400">
            FAQ
          </a>
        </li>
      </ul>
    </nav>
  );
}
