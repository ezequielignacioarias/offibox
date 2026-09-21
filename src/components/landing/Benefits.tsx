import type { ReactNode } from "react";

function IconBuilding() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20V8l8-4 8 4v12M9 20v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 8v4.5L15 15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 19h16M7 16V10M12 16V7M17 16v-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

const benefits: {
  title: string;
  description: string;
  icon: () => ReactNode;
}[] = [
  {
    title: "Operación centralizada",
    description:
      "Unifica archivos, trámites y comunicación interna para que nadie dependa de carpetas sueltas o chats desordenados.",
    icon: IconBuilding,
  },
  {
    title: "Ahorro de tiempo real",
    description:
      "Automatiza flujos repetitivos, reduce idas y vueltas y deja que tus equipos se enfoquen en trabajo de alto valor.",
    icon: IconClock,
  },
  {
    title: "Control y trazabilidad",
    description:
      "Cada acción queda registrada. Audita cambios, permisos y responsables con visibilidad clara para gerencia.",
    icon: IconShield,
  },
  {
    title: "Escala con tu empresa",
    description:
      "Empieza con lo esencial y activa módulos a medida que creces, sin migrar a otra plataforma.",
    icon: IconChart,
  },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Por qué Offibox
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Beneficios clave para tu empresa
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Pensado para equipos que necesitan orden operativo sin complejidad
            innecesaria.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
