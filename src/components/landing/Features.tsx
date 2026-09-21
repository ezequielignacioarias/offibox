"use client";

import { useState } from "react";

type ModuleId = "documentos" | "equipos" | "procesos" | "reportes";

type Module = {
  id: ModuleId;
  name: string;
  headline: string;
  description: string;
  benefits: string[];
  preview: {
    title: string;
    status: string;
    rows: { label: string; value: string; tone?: "ok" | "warn" | "muted" }[];
    highlight: string;
  };
};

const modules: Module[] = [
  {
    id: "documentos",
    name: "Documentos",
    headline: "Un repositorio único, con control de versiones.",
    description:
      "Carpetas por área, permisos por rol y búsqueda instantánea. Dejá de perseguir archivos en mails y discos compartidos.",
    benefits: [
      "Versionado automático y historial de cambios",
      "Acceso por rol y área, sin copias duplicadas",
      "Alertas de vencimiento de contratos y pólizas",
    ],
    preview: {
      title: "Repositorio corporativo",
      status: "1.284 archivos",
      rows: [
        { label: "Contrato_Proveedores_v4.pdf", value: "Legal · Hoy", tone: "ok" },
        { label: "Politica_HomeOffice.docx", value: "RR.HH. · Ayer", tone: "muted" },
        { label: "Póliza_Seguros_2026.pdf", value: "Vence en 12 días", tone: "warn" },
        { label: "Manual_Onboarding.pdf", value: "Ops · Versión 3", tone: "ok" },
      ],
      highlight: "3 documentos requieren revisión esta semana",
    },
  },
  {
    id: "equipos",
    name: "Equipos",
    headline: "Organigrama, onboarding y responsabilidades claros.",
    description:
      "Cada persona sabe qué hace, a quién reporta y qué tiene pendiente. Ideal para gerencias de operaciones y RR.HH.",
    benefits: [
      "Fichas de equipo y organigrama actualizado",
      "Checklists de onboarding en 5 días",
      "Carga de trabajo visible por área",
    ],
    preview: {
      title: "Equipos y RR.HH.",
      status: "36 colaboradores",
      rows: [
        { label: "Operaciones", value: "12 personas · 94% occupancy", tone: "ok" },
        { label: "Administración", value: "8 personas · 2 licencias", tone: "muted" },
        { label: "Onboarding abierto", value: "3 ingresos esta semana", tone: "warn" },
        { label: "Responsables de proceso", value: "18 asignados", tone: "ok" },
      ],
      highlight: "Onboarding promedio: 4,2 días",
    },
  },
  {
    id: "procesos",
    name: "Procesos",
    headline: "Aprobaciones y solicitudes que no se pierden.",
    description:
      "Flujos de compra, vacaciones, altas y cierres con recordatorios. Menos seguimiento manual, más cumplimiento.",
    benefits: [
      "Flujos de aprobación con responsables",
      "SLA y vencimientos con alertas",
      "Solicitudes internas en un solo canal",
    ],
    preview: {
      title: "Flujos en curso",
      status: "18 tareas abiertas",
      rows: [
        { label: "Aprobación de compra #482", value: "Gerencia · 1 día", tone: "warn" },
        { label: "Alta de proveedor", value: "Compras · En curso", tone: "ok" },
        { label: "Cierre de caja semanal", value: "Admin · Hoy 18:00", tone: "muted" },
        { label: "Solicitud de vacaciones", value: "RR.HH. · Pendiente", tone: "ok" },
      ],
      highlight: "SLA de aprobación: 11 horas promedio",
    },
  },
  {
    id: "reportes",
    name: "Reportes",
    headline: "Indicadores listos para dirección, no planillas sueltas.",
    description:
      "Actividad, cumplimiento y carga de trabajo en un panel que gerencia puede leer en minutos.",
    benefits: [
      "KPIs de operación y cumplimiento",
      "Exportación para directorio",
      "Tendencias semanales y mensuales",
    ],
    preview: {
      title: "Panel de dirección",
      status: "Actualizado hace 4 min",
      rows: [
        { label: "Cumplimiento de SLA", value: "99.9%", tone: "ok" },
        { label: "Horas ahorradas / mes", value: "186 h", tone: "ok" },
        { label: "Tickets internos abiertos", value: "-38% vs. trimestre", tone: "ok" },
        { label: "Procesos fuera de plazo", value: "2 · atención", tone: "warn" },
      ],
      highlight: "Informe ejecutivo disponible cada lunes 9:00",
    },
  },
];

function toneClass(tone?: "ok" | "warn" | "muted") {
  if (tone === "ok") return "text-emerald-700 bg-emerald-50";
  if (tone === "warn") return "text-amber-700 bg-amber-50";
  return "text-slate-500 bg-slate-100";
}

export default function Features() {
  const [activeId, setActiveId] = useState<ModuleId>("documentos");
  const active = modules.find((module) => module.id === activeId) ?? modules[0];

  return (
    <section id="modulos" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Plataforma modular
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Módulos que cubren el día a día
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Explorá cada módulo. El panel de la derecha muestra cómo se ve Offibox
            en operación real.
          </p>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {modules.map((module) => (
            <button
              key={module.id}
              type="button"
              onClick={() => setActiveId(module.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
                module.id === activeId
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {module.name}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div>
            <div className="hidden flex-col gap-2 lg:flex" role="tablist" aria-label="Módulos Offibox">
              {modules.map((module) => {
                const selected = module.id === activeId;
                return (
                  <button
                    key={module.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveId(module.id)}
                    className={`rounded-2xl border px-5 py-4 text-left transition duration-200 ${
                      selected
                        ? "border-teal-200 bg-teal-50 shadow-lg shadow-teal-900/5"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <span className="text-sm font-semibold text-slate-900">
                      {module.name}
                    </span>
                    <span className="mt-1 block text-sm text-slate-500">
                      {module.headline}
                    </span>
                  </button>
                );
              })}
            </div>

            <div key={active.id} className="mt-8 animate-fade-slide">
              <h3 className="text-xl font-semibold text-slate-900">{active.headline}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{active.description}</p>
              <ul className="mt-5 space-y-2.5">
                {active.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2.5 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                      ✓
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            key={`${active.id}-preview`}
            className="rounded-3xl border border-slate-200 bg-slate-950 p-5 shadow-xl shadow-slate-900/20 animate-fade-slide sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{active.preview.title}</p>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-teal-200">
                {active.preview.status}
              </span>
            </div>
            <div className="space-y-2.5">
              {active.preview.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3"
                >
                  <p className="truncate text-sm text-slate-200">{row.label}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${toneClass(row.tone)}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-xl bg-teal-500/15 px-4 py-3 text-sm font-medium text-teal-100">
              {active.preview.highlight}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
