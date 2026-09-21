const companies = [
  { name: "NorteSur", mark: "NS" },
  { name: "Atlas Ops", mark: "AO" },
  { name: "Meridian", mark: "MD" },
  { name: "Campo & Co", mark: "C&C" },
  { name: "Helios", mark: "HL" },
  { name: "Vertex", mark: "VX" },
];

export default function Logos() {
  return (
    <section
      aria-label="Empresas que confían en Offibox"
      className="border-y border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Empresas que confían en nosotros
        </p>
        <ul className="mt-8 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <li key={company.name} className="flex justify-center">
              <div className="flex items-center gap-2 grayscale opacity-50 transition duration-300 hover:opacity-90 hover:grayscale-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-slate-50 text-[10px] font-bold tracking-tight text-slate-500">
                  {company.mark}
                </span>
                <span className="text-sm font-semibold tracking-tight text-slate-500">
                  {company.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
