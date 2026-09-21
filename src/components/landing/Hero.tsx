export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-white to-white"
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-0 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-teal-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 shadow-sm">
            Software de gestión para empresas
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            Toda tu oficina, en un solo lugar.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Offibox centraliza documentos, equipos, procesos y reportes para que
            tu empresa opere con más orden, menos fricción y control total desde
            cualquier dispositivo.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contacto"
              className="inline-flex items-center justify-center rounded-full bg-teal-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition duration-200 hover:bg-teal-700 hover:shadow-xl"
            >
              Solicitar una demo
            </a>
            <a
              href="#modulos"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition duration-200 hover:bg-slate-50 hover:shadow-md"
            >
              Ver módulos
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span>Implementación en semanas</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <span>Sin hardware extra</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <span>Soporte en español</span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-teal-900/5 transition duration-300 hover:shadow-xl">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Panel Offibox</p>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              En línea
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Documentos", value: "1.284" },
              { label: "Equipos", value: "36" },
              { label: "Tareas abiertas", value: "18" },
              { label: "SLA", value: "99.9%" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-slate-50 px-4 py-5 transition duration-200 hover:bg-slate-100"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-teal-600 px-5 py-4 text-white shadow-lg shadow-teal-600/20">
            <p className="text-sm font-medium text-teal-100">Próximo vencimiento</p>
            <p className="mt-1 text-lg font-semibold">Cierre mensual · 3 días</p>
          </div>
        </div>
      </div>
    </section>
  );
}
