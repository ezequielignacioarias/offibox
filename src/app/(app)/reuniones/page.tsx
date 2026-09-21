import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Video,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Users,
  Trash2,
} from 'lucide-react'

import PageContainer from '@/components/ui/PageContainer'
import PageHeader from '@/components/ui/PageHeader'
import CopyRoomButton from '@/components/reuniones/CopyRoomButton'
import NewMeetingModal from '@/components/reuniones/NewMeetingModal'

import {
  createMeetingAction,
  deleteMeetingAction,
} from './actions'

export default async function ReunionesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si no hay sesión, enviar al login
  if (!user) {
    redirect('/auth/login')
  }

  // Obtener las reuniones del usuario
  const { data: scheduledMeetings } = await supabase
    .from('meetings')
    .select('*')
    .eq('user_id', user.id)
    .order('meeting_date', { ascending: true })
    .limit(5)

  // Sala permanente de Offibox
  const permanentRoomUrl =
    'https://meet.google.com/offibox-virtual-room'

  return (
    <PageContainer>
      <PageHeader
        icon={Video}
        title="Sala de Reuniones"
        description="Centro de videollamadas, enlaces fijos y agenda ejecutiva"
        iconTheme="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        actions={
          <div className="flex items-center gap-2">
            <NewMeetingModal
              createMeetingAction={createMeetingAction}
            />

            <Link
              href="/inicio"
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer flex items-center justify-center shadow-sm"
              title="Volver al inicio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        }
      />

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Columna izquierda */}
        <div className="lg:col-span-2 space-y-6">

          {/* Sala fija */}
          <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6">

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Enlace Principal Activo
                </span>

                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Seguro y cifrado
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Tu Sala Virtual Offibox
              </h3>

              <p className="text-sm text-neutral-400 mb-6">
                Comparte este enlace fijo con tus clientes o
                proveedores para reuniones recurrentes sin
                necesidad de crear salas nuevas cada vez.
              </p>

              <CopyRoomButton
                roomUrl={permanentRoomUrl}
              />
            </div>

            <div className="pt-4 border-t border-neutral-800/80 text-xs text-neutral-500 flex items-center justify-between">
              <span>
                Estado: Listo para recibir llamadas
              </span>

              <span className="text-emerald-400 font-medium">
                ● 0 en espera
              </span>
            </div>
          </div>

          {/* Próximas reuniones */}
          <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />

                <h3 className="text-base font-bold text-white">
                  Próximas Reuniones Programadas
                </h3>
              </div>

              <span className="text-xs text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800">
                {scheduledMeetings?.length || 0} agendadas
              </span>

            </div>

            {scheduledMeetings &&
            scheduledMeetings.length > 0 ? (
              <div className="space-y-3">

                {scheduledMeetings.map((meeting: any) => {

                  const startDate = new Date(
                    meeting.meeting_date
                  )

                  // Duración predeterminada: 1 hora
                  const endDate = new Date(
                    startDate.getTime() +
                      60 * 60 * 1000
                  )

                  // Formato compatible con Google Calendar
                  const formatGoogleDate = (
                    date: Date
                  ) => {
                    return date
                      .toISOString()
                      .replace(/-|:|\.\d\d\d/g, '')
                  }

                  const details =
                    'Reunión agendada desde Offibox: ' +
                    (meeting.meeting_url ||
                      permanentRoomUrl)

                  const gCalendarUrl =
                    `https://calendar.google.com/calendar/render` +
                    `?action=TEMPLATE` +
                    `&text=${encodeURIComponent(
                      meeting.title
                    )}` +
                    `&dates=${formatGoogleDate(
                      startDate
                    )}/${formatGoogleDate(endDate)}` +
                    `&details=${encodeURIComponent(
                      details
                    )}`

                  return (
                    <div
                      key={meeting.id}
                      className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800/80 rounded-xl"
                    >

                      <div>
                        <h4 className="text-xs font-semibold text-white">
                          {meeting.title}
                        </h4>

                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {new Date(
                            meeting.meeting_date
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">

                        {/* Google Calendar */}
                        <a
                          href={gCalendarUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 rounded-lg text-xs font-medium transition"
                          title="Llevar a Google Calendar"
                        >
                          📅 Sincronizar
                        </a>

                        {/* Unirse a la reunión */}
                        <a
                          href={
                            meeting.meeting_url ||
                            permanentRoomUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-medium transition"
                        >
                          Unirse
                        </a>

                        {/* Eliminar reunión */}
                        <form
                          action={deleteMeetingAction}
                        >
                          <input
                            type="hidden"
                            name="meetingId"
                            value={meeting.id}
                          />

                          <button
                            type="submit"
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition flex items-center justify-center"
                            title="Eliminar reunión"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>

                      </div>
                    </div>
                  )
                })}

              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-neutral-800 rounded-xl">

                <Users className="w-8 h-8 text-neutral-600 mx-auto mb-2" />

                <p className="text-xs text-neutral-400">
                  No hay reuniones próximas sincronizadas.
                </p>

                <p className="text-[11px] text-neutral-600 mt-0.5">
                  Las citas agendadas desde el calendario
                  aparecerán aquí.
                </p>

              </div>
            )}

          </div>
        </div>

        {/* Columna derecha */}
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">

          <div>

            <h3 className="text-lg font-bold text-white mb-2">
              Plataformas Externas
            </h3>

            <p className="text-sm text-neutral-400 mb-4">
              Inicia una llamada rápida al instante en tu
              servicio preferido:
            </p>

            <div className="space-y-3">

              {/* Google Meet */}
              <a
                href="https://meet.new"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-between transition text-neutral-300 hover:text-white shadow-inner"
              >
                <span>
                  Crear Google Meet Instantáneo
                </span>

                <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              </a>

              {/* Zoom */}
              <a
                href="https://zoom.us/start/videomeeting"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-between transition text-neutral-300 hover:text-white shadow-inner"
              >
                <span>
                  Iniciar Reunión en Zoom
                </span>

                <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              </a>

              {/* Jitsi */}
              <a
                href="https://meet.jit.si"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-between transition text-neutral-300 hover:text-white shadow-inner"
              >
                <span>
                  Abrir Sala Jitsi (Libre)
                </span>

                <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              </a>

            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500 text-center">
            Acceso directo sin instalaciones previas
          </div>

        </div>
      </div>
    </PageContainer>
  )
}