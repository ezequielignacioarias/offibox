"use client";

import { useState } from "react";

const faqs = [
  {
    question: "¿Cómo protege Offibox la información de la empresa?",
    answer:
      "Los datos se cifran en tránsito y en reposo. El acceso es por rol, con registro de auditoría de cada acción. Podés restringir carpetas y módulos por área, y revocar sesiones en cualquier momento.",
  },
  {
    question: "¿Cuánto tarda la implementación?",
    answer:
      "La mayoría de los equipos arranca en 2 a 4 semanas: configuración de áreas, permisos, migración de documentos clave y capacitación de referentes. No hace falta hardware adicional ni un proyecto de meses.",
  },
  {
    question: "¿Qué incluye el soporte técnico?",
    answer:
      "Soporte en español por correo y canal dedicado, con horario hábil extendido. Los planes corporativos suman un referente de éxito de cliente y sesiones de onboarding para nuevas áreas.",
  },
  {
    question: "¿Podemos empezar solo con un módulo?",
    answer:
      "Sí. Muchas empresas comienzan con Documentos o Procesos y activan Equipos y Reportes cuando la operación lo pide. El modelo es modular para no pagar por lo que todavía no usás.",
  },
  {
    question: "¿Se puede migrar lo que ya tenemos en Drive o carpetas locales?",
    answer:
      "Sí. Acompañamos la importación de estructuras existentes y definimos convenciones de carpetas para no arrastrar el desorden. El historial reciente queda disponible para auditoría.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Preguntas frecuentes
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Resolvemos las objeciones de compra
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Seguridad, tiempos y soporte: lo que suelen preguntar gerencias antes de
            avanzar.
          </p>
        </div>

        <div className="mt-12 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
          {faqs.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-slate-50 sm:px-6"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                >
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">
                    {item.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition duration-200 ${
                      open ? "rotate-45 bg-teal-50 text-teal-700" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-7 text-slate-600 sm:px-6">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
