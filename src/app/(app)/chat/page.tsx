'use client'

import { useState, useEffect, useRef } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { 
  Hash, 
  Send, 
  Paperclip, 
  Smile, 
  MessageSquare, 
  Plus, 
  Search, 
  FileText, 
  Download, 
  X,
  Pin,
  Trash2,
  Edit2,
  Check,
  Maximize2,
  PinOff
} from 'lucide-react'

const COMMON_EMOJIS = ['😀', '😂', '🔥', '👍', '❤️', '🎉', '🚀', '💡', '⚠️', '✅', '❌', '📌', '💻', '☕', '👀']
const QUICK_EMOJIS = ['👍', '❤️', '🔥', '👀', '✅']

export default function ChatPage() {
  const [channels, setChannels] = useState<any[]>([])
  const [activeChannel, setActiveChannel] = useState('general')
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // Estados avanzados
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  // Estado para el modal de nuevo canal
  const [showChannelModal, setShowChannelModal] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const realtimeChannelRef = useRef<any>(null)
  const supabase = createBrowserSupabaseClient()

  // 1. Obtener usuario actual
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  // 2. Cargar canales y mantener suscripción Realtime de Canales en vivo
  const fetchChannels = async () => {
    const { data, error } = await supabase.from('channels').select('*').order('name', { ascending: true })
    if (!error && data) {
      setChannels(data)
    }
  }

  useEffect(() => {
    fetchChannels()

    // Suscripción Realtime para la lista de canales (creación/eliminación en vivo)
    const channelsSubscription = supabase
      .channel('public:channels')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'channels' },
        (payload: any) => { // <--- Tipado explícito agregado
          if (payload.eventType === 'INSERT') {
            setChannels((prev) => {
              if (prev.some((ch) => ch.id === payload.new.id || ch.name === payload.new.name)) return prev
              return [...prev, payload.new].sort((a, b) => a.name.localeCompare(b.name))
            })
          } else if (payload.eventType === 'DELETE') {
            setChannels((prev) => prev.filter((ch) => ch.id !== payload.old.id && ch.name !== payload.old.name))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channelsSubscription)
    }
  }, [supabase])

  // 3. Crear nuevo canal en vivo
  const handleCreateChannelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChannelName.trim()) return

    const formattedName = newChannelName.trim().toLowerCase().replace(/\s+/g, '-')
    
    const { data, error } = await supabase.from('channels').insert([{ name: formattedName }]).select()
    
    if (error) {
      alert('El canal ya existe o ocurrió un error.')
      return
    }

    if (data && data.length > 0) {
      setChannels((prev) => {
        if (prev.some((ch) => ch.name === formattedName)) return prev
        return [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name))
      })
    }

    setNewChannelName('')
    setShowChannelModal(false)
    setActiveChannel(formattedName)
  }

  // 4. Cargar mensajes y configurar Realtime + Presence del canal activo
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('channel', activeChannel)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setMessages(data)
      }
    }

    fetchMessages()

    const channel = supabase.channel(`room:${activeChannel}`)
    realtimeChannelRef.current = channel

    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `channel=eq.${activeChannel}` },
        (payload: any) => { // <--- Tipado explícito agregado
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => {
              if (prev.some((msg) => msg.id === payload.new.id)) return prev
              return [...prev, payload.new]
            })
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) => prev.map((msg) => msg.id === payload.new.id ? payload.new : msg))
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id))
          }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const usersTyping: string[] = []
        Object.values(state).forEach((presences: any) => {
          presences.forEach((p: any) => {
            if (p.typing && p.user !== user?.email) {
              usersTyping.push(p.user.split('@')[0])
            }
          })
        })
        setTypingUsers(usersTyping)
      })
      .subscribe(async (status: string) => { // <--- Tipado explícito agregado
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({ user: user.email, typing: false })
        }
      })

    return () => {
      realtimeChannelRef.current = null
      supabase.removeChannel(channel)
    }
  }, [activeChannel, supabase, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Notificar estado "Escribiendo..." en vivo
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    if (!user || !realtimeChannelRef.current) return

    realtimeChannelRef.current.track({ user: user.email, typing: true })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      realtimeChannelRef.current?.track({ user: user.email, typing: false })
    }, 2000)
  }

  // Enviar mensaje con actualización local inmediata
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!newMessage.trim() && !selectedFile) || !user) return

    let fileUrl = null
    let fileName = null

    setUploading(true)

    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop()
      fileName = selectedFile.name
      const filePath = `${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, selectedFile)

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('chat-files')
          .getPublicUrl(filePath)
        fileUrl = publicUrlData.publicUrl
      }
    }

    const senderName = user.email ? user.email.split('@')[0] : 'Usuario'

    if (realtimeChannelRef.current) {
      realtimeChannelRef.current.track({ user: user.email, typing: false })
    }

    const { data, error } = await supabase.from('messages').insert([
      {
        content: newMessage || (selectedFile ? `📎 Adjuntó un archivo: ${selectedFile.name}` : ''),
        channel: activeChannel,
        sender_email: user.email,
        sender_name: senderName,
        file_url: fileUrl,
        file_name: fileName,
        reactions: {},
        is_pinned: false
      },
    ]).select()

    if (!error && data && data.length > 0) {
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === data[0].id)) return prev
        return [...prev, data[0]]
      })
    }

    setUploading(false)
    setSelectedFile(null)
    setNewMessage('')
    setShowEmojiPicker(false)
  }

  // Eliminar mensaje en vivo
  const handleDeleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
    await supabase.from('messages').delete().eq('id', id)
  }

  // Editar mensaje en vivo
  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return
    const editedAt = new Date().toISOString()

    setMessages((prev) => prev.map((msg) => msg.id === id ? { ...msg, content: editText, edited_at: editedAt } : msg))
    setEditingId(null)
    setEditText('')

    const { error } = await supabase
      .from('messages')
      .update({ 
        content: editText, 
        edited_at: editedAt 
      })
      .eq('id', id)

    if (error) {
      console.error('Error al editar el mensaje:', error.message)
    }
  }

  // Fijar / Desfijar mensaje en vivo
  const handleTogglePin = async (id: string, currentPin: boolean) => {
    const newPin = !currentPin
    setMessages((prev) => prev.map((msg) => msg.id === id ? { ...msg, is_pinned: newPin } : msg))
    await supabase.from('messages').update({ is_pinned: newPin }).eq('id', id)
  }

  // Agregar / Quitar Reacción con Emojis en vivo
  const handleAddReaction = async (msg: any, emoji: string) => {
    const reactions = JSON.parse(JSON.stringify(msg.reactions || {}))
    const userEmail = user?.email

    if (!userEmail) return

    if (!reactions[emoji]) {
      reactions[emoji] = [userEmail]
    } else if (reactions[emoji].includes(userEmail)) {
      reactions[emoji] = reactions[emoji].filter((email: string) => email !== userEmail)
      if (reactions[emoji].length === 0) {
        delete reactions[emoji]
      }
    } else {
      reactions[emoji].push(userEmail)
    }

    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, reactions } : m))

    await supabase.from('messages').update({ reactions }).eq('id', msg.id)
  }

  const filteredMessages = messages.filter((msg) => 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.sender_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pinnedMessages = messages.filter((msg) => msg.is_pinned)

  return (
    <div className="flex h-full w-full bg-neutral-950/40 backdrop-blur-sm text-neutral-100 overflow-hidden relative">
      
      {/* PANEL IZQUIERDO: Canales */}
      <div className="w-72 bg-neutral-900/40 backdrop-blur-md border-r border-neutral-800 flex flex-col shrink-0">
        <div className="h-16 px-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-xs tracking-wide uppercase text-neutral-200">Chat Interno</span>
          </div>
          <button 
            onClick={() => setShowChannelModal(true)}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
            title="Crear nuevo canal"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 border-b border-neutral-800/60 shrink-0">
          <div className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs">
            <Search className="w-3.5 h-3.5 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Buscar en mensajes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-neutral-200 placeholder:text-neutral-600 w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-neutral-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
          <div>
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-2">Canales</div>
            <div className="space-y-1">
              {channels.map((ch) => (
                <button
                  key={ch.id || ch.name}
                  onClick={() => setActiveChannel(ch.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    activeChannel === ch.name
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 backdrop-blur-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{ch.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO: Conversación */}
      <div className="flex-1 flex flex-col bg-neutral-950/20 min-h-0 overflow-hidden">
        <div className="h-16 border-b border-neutral-800 px-6 flex items-center justify-between bg-neutral-900/20 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-neutral-400" />
            <h3 className="font-bold text-sm text-white">{activeChannel}</h3>
          </div>
          {searchQuery && (
            <span className="text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 backdrop-blur-sm">
              Filtrando por: &quot;{searchQuery}&quot;
            </span>
          )}
        </div>

        {/* BARRA DE MENSAJES FIJADOS (PINS) */}
        {pinnedMessages.length > 0 && (
          <div className="bg-blue-950/20 backdrop-blur-sm border-b border-blue-500/20 px-6 py-2 flex items-center gap-3 text-xs shrink-0">
            <Pin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div className="flex-1 truncate text-neutral-300">
              <strong className="text-blue-400">Mensaje fijado:</strong> {pinnedMessages[pinnedMessages.length - 1].content}
            </div>
          </div>
        )}

        {/* Historial de Mensajes */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 min-h-0">
          {filteredMessages.map((msg) => {
            const timeFormatted = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            const isOwner = user?.email === msg.sender_email
            const isEditing = editingId === msg.id

            return (
              <div key={msg.id} className="flex items-start gap-3.5 group relative">
                <div className="w-8 h-8 rounded-xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center font-bold text-xs text-blue-400 shrink-0 shadow-sm">
                  {msg.sender_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white">{msg.sender_name}</span>
                    <span className="text-[10px] text-neutral-500">{timeFormatted}</span>
                    {msg.edited_at && <span className="text-[9px] text-neutral-600">(editado)</span>}
                    {msg.is_pinned && <Pin className="w-3 h-3 text-blue-400 fill-blue-400/20 ml-1" />}
                  </div>
                  
                  {isEditing ? (
                    <div className="mt-2 flex items-center gap-2">
                      <input 
                        type="text" 
                        value={editText} 
                        onChange={(e) => setEditText(e.target.value)}
                        className="bg-neutral-900/80 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white w-full outline-none focus:border-blue-500"
                      />
                      <button onClick={() => handleSaveEdit(msg.id)} className="p-1.5 bg-blue-600 rounded-xl text-white hover:bg-blue-500 cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 bg-neutral-800 rounded-xl text-neutral-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed bg-neutral-900/40 backdrop-blur-sm p-3 rounded-2xl border border-neutral-800/60 inline-block max-w-2xl break-words">
                      {msg.content}
                    </p>
                  )}

                  {/* Renderizar archivo o imagen adjunta */}
                  {msg.file_url && (
                    <div className="mt-2 max-w-sm rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm shadow-md">
                      {msg.file_name && /\.(jpg|jpeg|png|webp|gif)$/i.test(msg.file_name) ? (
                        <div className="relative group/img cursor-pointer" onClick={() => setLightboxImage(msg.file_url)}>
                          <img 
                            src={msg.file_url} 
                            alt={msg.file_name} 
                            className="w-full h-auto max-h-56 object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center text-white gap-1 text-xs font-medium">
                            <Maximize2 className="w-4 h-4" /> Ampliar
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3">
                          <FileText className="w-6 h-6 text-blue-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-neutral-200 truncate">{msg.file_name || 'Archivo adjunto'}</p>
                            <span className="text-[10px] text-neutral-500">Documento</span>
                          </div>
                          <a 
                            href={msg.file_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                            title="Descargar archivo"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reacciones de Emojis */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {msg.reactions && Object.entries(msg.reactions).map(([emoji, users]: [string, any]) => {
                      const hasReacted = users.includes(user?.email)
                      return (
                        <button
                          key={emoji}
                          onClick={() => handleAddReaction(msg, emoji)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border transition cursor-pointer backdrop-blur-sm ${
                            hasReacted 
                              ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
                              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span>{users.length}</span>
                        </button>
                      )
                    })}

                    {/* Botón rápido para agregar reacción */}
                    <div className="relative group/emoji">
                      <button className="p-1 rounded-full bg-neutral-900/60 border border-neutral-800 text-neutral-500 hover:text-neutral-300 transition opacity-0 group-hover:opacity-100 cursor-pointer">
                        <Smile className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-full left-0 mb-1 hidden group-hover/emoji:flex items-center gap-1 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-1 rounded-xl shadow-lg z-10">
                        {QUICK_EMOJIS.map((emoji) => (
                          <button key={emoji} onClick={() => handleAddReaction(msg, emoji)} className="p-1 hover:bg-neutral-800 rounded-lg text-sm cursor-pointer">
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones flotantes del mensaje */}
                <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-xl p-1 shadow-md">
                  <button onClick={() => handleTogglePin(msg.id, msg.is_pinned)} className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg cursor-pointer" title={msg.is_pinned ? "Desfijar" : "Fijar mensaje"}>
                    {msg.is_pinned ? <PinOff className="w-3.5 h-3.5 text-blue-400" /> : <Pin className="w-3.5 h-3.5" />}
                  </button>
                  {isOwner && (
                    <>
                      <button onClick={() => { setEditingId(msg.id); setEditText(msg.content); }} className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg cursor-pointer" title="Editar">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 rounded-lg cursor-pointer" title="Eliminar">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Indicador de "Escribiendo..." */}
        {typingUsers.length > 0 && (
          <div className="px-6 py-1 text-[11px] text-neutral-400 italic shrink-0 animate-pulse">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'está escribiendo...' : 'están escribiendo...'}
          </div>
        )}

        {/* Vista previa del archivo seleccionado antes de enviar */}
        {selectedFile && (
          <div className="px-6 py-2 bg-neutral-900/60 backdrop-blur-md border-t border-neutral-800 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2 text-neutral-300">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Archivo listo para enviar: <strong>{selectedFile.name}</strong></span>
            </div>
            <button onClick={() => setSelectedFile(null)} className="text-neutral-500 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* CAJA DE ENTRADA CON SELECTOR DE EMOJIS */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/20 backdrop-blur-md shrink-0 relative">
          
          {showEmojiPicker && (
            <div className="absolute bottom-20 left-4 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-3 rounded-2xl shadow-2xl grid grid-cols-5 gap-2 z-20">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setNewMessage((prev) => prev + emoji)
                  }}
                  className="p-2 hover:bg-neutral-800 rounded-xl text-lg transition cursor-pointer flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 rounded-2xl px-4 py-2 focus-within:border-neutral-700 transition shadow-inner">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
              title="Adjuntar archivo"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`transition cursor-pointer ${showEmojiPicker ? 'text-blue-400' : 'text-neutral-500 hover:text-neutral-300'}`}
              title="Insertar emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            <input 
              type="text" 
              value={newMessage}
              onChange={handleTyping}
              placeholder={uploading ? "Subiendo archivo..." : `Enviar mensaje a #${activeChannel}...`} 
              disabled={uploading}
              className="w-full bg-transparent border-none outline-none text-xs text-neutral-200 placeholder:text-neutral-600 py-1.5"
            />
            <button type="submit" disabled={uploading} className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-600/30 cursor-pointer disabled:opacity-50">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* MODAL PERSONALIZADO PARA CREAR CANAL */}
      {showChannelModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-500" /> Crear nuevo canal
              </h3>
              <button 
                onClick={() => setShowChannelModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreateChannelSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1.5">Nombre del canal</label>
                <input 
                  type="text" 
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="ej. soporte-tecnico, diseno" 
                  autoFocus
                  className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowChannelModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition cursor-pointer shadow-md shadow-blue-600/30"
                >
                  Crear canal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL PARA IMÁGENES */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setLightboxImage(null)}>
          <button className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition cursor-pointer">
            <X className="w-6 h-6" />
          </button>
          <img src={lightboxImage} alt="Vista ampliada" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  )
}