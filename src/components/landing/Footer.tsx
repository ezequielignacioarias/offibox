export default function Footer() {
  return (
    <footer id="contacto" className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-10 text-white shadow-xl shadow-teal-900/30 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                ¿Listos para ordenar la oficina?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-teal-50">
                Agendá una demo de 30 minutos y ves Offibox con tus procesos, no con
                una presentación genérica.
              </p>
            </div>
            <a
              href="mailto:hola@offibox.com"
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-teal-800 shadow-lg transition duration-200 hover:bg-teal-50 hover:shadow-xl"
            >
              Escribir a comercial
            </a>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-lg font-semibold text-white">Offibox</p>
            <p className="mt-3 max-w-md text-sm leading-6">
              La plataforma para centralizar la oficina de tu empresa: documentos,
              equipos, procesos y reportes en un entorno seguro y fácil de usar.
            </p>
            <a
              href="mailto:hola@offibox.com"
              className="mt-5 inline-flex text-sm font-medium text-teal-400 transition-colors hover:text-teal-300"
            >
              hola@offibox.com
            </a>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Producto</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#beneficios" className="transition-colors hover:text-white">
                  Beneficios
                </a>
              </li>
              <li>
                <a href="#modulos" className="transition-colors hover:text-white">
                  Módulos
                </a>
              </li>
              <li>
                <a href="#testimonios" className="transition-colors hover:text-white">
                  Clientes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Empresa</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#faq" className="transition-colors hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contacto" className="transition-colors hover:text-white">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#contacto" className="transition-colors hover:text-white">
                  Privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Offibox. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
