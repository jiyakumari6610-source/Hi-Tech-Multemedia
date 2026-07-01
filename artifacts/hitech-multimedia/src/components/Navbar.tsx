import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Camera, Menu, X, Settings } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "bg-zinc-950/97 backdrop-blur-md border-b border-[#D4AF37]/15 shadow-xl shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
              <Camera className="w-4.5 h-4.5 text-[#D4AF37]" />
            </div>
            <div className="leading-tight">
              <span className="font-serif text-white text-base font-bold tracking-wide">Hi-tech</span>
              <span className="font-serif text-[#D4AF37] text-base font-bold tracking-wide ml-1">Multimedia</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium tracking-wide transition-colors rounded-sm group ${
                  isActive(link.href)
                    ? "text-[#D4AF37]"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-px transition-all duration-300 ${
                    isActive(link.href) ? "bg-[#D4AF37]" : "bg-[#D4AF37] scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/40 text-[#D4AF37] text-sm font-medium rounded-sm hover:bg-[#D4AF37] hover:text-zinc-950 hover:border-[#D4AF37] transition-all duration-300"
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-zinc-300 hover:text-white transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-zinc-800 pt-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-[#D4AF37] bg-[#D4AF37]/10"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-[#D4AF37]/40 text-[#D4AF37] text-sm font-medium rounded-sm hover:bg-[#D4AF37]/10 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
