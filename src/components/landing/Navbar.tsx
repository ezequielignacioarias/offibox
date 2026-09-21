"use client";

import { useState } from "react";
import Link from "next/link"; // 👈 1. Importamos Link de Next.js

const navLinks = [
  { href: "#beneficios", label: "Beneficios" },
  { href: "#modulos", label: "Módulos" },
  { href: "#testimonios", label: "Clientes" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-shadow">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <a href="#inicio" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white shadow-lg shadow-teal-600/25">
            Ob
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Offibox
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-teal-700"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {/* 👈 2. Botón de Iniciar sesión en versión escritorio */}
          <Link
            href="/login" 
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100"
          >
            Iniciar sesión
          </Link>
          <a
            href="#contacto"
            className="rounded-full bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition duration-200 hover:bg-teal-700 hover:shadow-xl"
          >
            Solicitar demo
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Abrir menú</span>
          {open ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            {/* 👈 3. Botón de Iniciar sesión en versión móvil */}
            <Link
              href="/login"
              className="rounded-full border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700"
              onClick={() => setOpen(false)}
            >
              Iniciar sesión
            </Link>
            <a
              href="#contacto"
              className="rounded-full bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg"
              onClick={() => setOpen(false)}
            >
              Solicitar demo
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}