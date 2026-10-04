"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CtaLink from "@/components/CtaLink";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const landing = usePathname() === "/start"; // ad page par distraction kam

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="wrap nav-row">
        <Link href="/" className="logo">Citeo<span className="dot">.</span></Link>
        {landing ? (
          <a href="#inquiry" className="btn btn-sm">Get a free estimate</a>
        ) : (
          <>
            <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
              {open ? "Close" : "Menu"}
            </button>
            <nav className={`nav-links ${open ? "show" : ""}`} onClick={() => setOpen(false)}>
              <Link href="/#services">Services</Link>
              <Link href="/#work">Work</Link>
              <Link href="/#process">Process</Link>
              <Link href="/contact">Contact</Link>
              <CtaLink href="/book" event="cta_click" label="nav_book" className="btn btn-sm">Book a consultation</CtaLink>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
