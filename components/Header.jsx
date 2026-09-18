"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-inner">

        <Link
          href="/"
          className="brand"
          onClick={closeMenu}
        >
          <img
            src="/lokmadat-logo.png"
            alt="लोकमदत"
            className="brand-logo"
          />
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={`main-nav ${
            menuOpen ? "mobile-open" : ""
          }`}
        >
          <Link href="/" onClick={closeMenu}>
            मुख्यपृष्ठ
          </Link>

          <Link href="/archive" onClick={closeMenu}>
            सर्व बातम्या
          </Link>

          <Link href="/epaper" onClick={closeMenu}>
            ई-पेपर
          </Link>

          <Link href="/admin" onClick={closeMenu}>
            Admin
          </Link>
        </nav>

      </div>
    </header>
  );
}
