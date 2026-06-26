"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home",     href: "/",        anchor: null },
  { label: "About",    href: "/#about",   anchor: "about" },
  { label: "Projects", href: "/#projects", anchor: "projects" },
  { label: "Contact",  href: "/#contact",  anchor: "contact" },
];

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
        letterSpacing="-0.5"
      >
        SS
      </text>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-800/80"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 rounded-lg"
          aria-label="Supratim Sarkar — home"
        >
          <Logo />
          <span className="text-white font-black text-base tracking-tight group-hover:text-violet-400 transition-colors">
            Supratim
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              {isHome && link.anchor ? (
                <a
                  href={`#${link.anchor}`}
                  className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
          <li className="ml-4">
            <a
              href="https://github.com/codewithsupra"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-zinc-700 text-zinc-300 hover:border-violet-500 hover:text-violet-400 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              GitHub
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 rounded"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`w-5 h-px bg-white transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-0.75" : ""}`} />
          <span className={`w-5 h-px bg-white transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-0.75" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden border-t border-zinc-800 bg-[#0a0a0a]/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="px-6 py-4 space-y-1" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              {isHome && link.anchor ? (
                <a
                  href={`#${link.anchor}`}
                  className="block text-zinc-300 hover:text-white text-base font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="block text-zinc-300 hover:text-white text-base font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
          <li className="pt-2">
            <a
              href="https://github.com/codewithsupra"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-violet-400 hover:text-violet-300 text-base font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              GitHub ↗
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
