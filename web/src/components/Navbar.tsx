"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/ugc", label: "UGC" },
  { href: "/groups", label: "Groups" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-lg border-b border-border" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image src="/icon.png" alt="Woob Studios" width={30} height={30} className="group-hover:opacity-80 transition-opacity" />
            <span className="text-sm font-bold tracking-tight">Woob Studios</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2.5 text-base font-medium rounded-lg transition-all duration-200 ${
                  pathname === link.href
                    ? "text-primary-light bg-primary/10"
                    : "text-muted hover:text-foreground hover:bg-surface-light"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button className="md:hidden p-2 text-muted hover:text-foreground rounded-lg" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-200 ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-surface border-t border-border px-4 py-2 space-y-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2.5 text-sm rounded-lg transition-all ${
                pathname === link.href
                  ? "text-primary-light bg-primary/10 font-medium"
                  : "text-muted hover:text-foreground hover:bg-surface-light"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
