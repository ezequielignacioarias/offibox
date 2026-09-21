const testimonials = [
  {
    quote:
      "Pasamos de perseguir planillas a tener el cierre semanal listo el viernes a las 16. El equipo de operaciones dejó de vivir en el chat.",
    name: "Mariana Soler",
    role: "Directora de Operaciones",
    company: "NorteSur Logística",
    metric: "12 h",
    metricLabel: "ahorradas por semana",
  },
  {
    quote:
      "Implementamos documentos y procesos en tres semanas. La trazabilidad nos dio visibilidad que el directorio pedía hace años.",
    name: "Diego Herrera",
    role: "Gerente de Administración",
    company: "Atlas Ops",
    metric: "38%",
    metricLabel: "menos tickets internos",
  },
  {
    quote:
      "Onboarding y aprobaciones dejaron de ser un cuello de botella. Offibox se siente como una oficina, no como otro sistema más.",
    name: "Lucía Paredes",
    role: "Gerenta de Personas",
    company: "Meridian",
    metric: "4,2 días",
    metricLabel: "onboarding promedio",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Resultados reales
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Lo que destacan gerencias y dirección
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Métricas de ahorro de tiempo y control operativo, no promesas genéricas.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-900/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <p className="text-3xl font-bold tracking-tight text-teal-700">
                {item.metric}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {item.metricLabel}
              </p>
              <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">
                “{item.quote}”
              </p>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">
                  {item.role} · {item.company}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
