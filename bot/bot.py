import os
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
from supabase import create_client, Client

# --- CONFIGURACIÓN ---
SUPABASE_URL = "https://qstkvjgzihmidqyieytr.supabase.co"
SUPABASE_KEY = "sb_publishable_jVVtPiTOvfwnKxD7duZR4Q_VQCGpEbi"
TOKEN = '8106039250:AAHyWguqHRnELxglUhRfwwImVNUv7OGmo-I'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['proyectos'])
def listar_proyectos_con_botones(message):
    try:
        res = supabase.table("projects").select("id, name, status, category").execute()
        if not res.data:
            bot.reply_to(message, "📂 Todavía no tenés proyectos cargados.")
            return
            
        for p in res.data:
            markup = InlineKeyboardMarkup()
            # Botones con los estados exactos: "en progreso" y "completado"
            markup.row(
                InlineKeyboardButton("🚀 En progreso", callback_data=f"status_{p['id']}_en progreso"),
                InlineKeyboardButton("✅ Completado", callback_data=f"status_{p['id']}_completado")
            )
            markup.row(
                InlineKeyboardButton("💡 Idea", callback_data=f"status_{p['id']}_idea"),
                InlineKeyboardButton("📝 Ver Tareas", callback_data=f"ver_{p['id']}")
            )
            
            short_id = p['id'][:8]
            texto_info = (
                f"🔹 *[{short_id}] - {p['name']}*\n"
                f"• Categoría: {p.get('category', 'General')}\n"
                f"• Estado: `{p['status']}`"
            )
            
            bot.send_message(message.chat.id, texto_info, parse_mode="Markdown", reply_markup=markup)
    except Exception as e:
        bot.reply_to(message, f"❌ Error: `{e}`", parse_mode="Markdown")

@bot.callback_query_handler(func=lambda call: True)
def manejar_botones(call):
    # 1. RESPONDER INMEDIATAMENTE A TELEGRAM para evitar que el query expire
    try:
        bot.answer_callback_query(call.id)
    except Exception:
        pass

    data = call.data
    try:
        if data.startswith("status_"):
            # Separamos el UUID del estado
            partes = data.split('_', 2)
            proyecto_id = partes[1]
            nuevo_estado = partes[2]
            
            # 2. Actualizar en Supabase después de responder el callback
            supabase.table("projects").update({"status": nuevo_estado}).eq("id", proyecto_id).execute()
            
            try:
                bot.edit_message_text(
                    chat_id=call.message.chat.id,
                    message_id=call.message.message_id,
                    text=f"🔹 Proyecto ID `{proyecto_id[:8]}...` actualizado a: *{nuevo_estado}*",
                    parse_mode="Markdown"
                )
            except Exception:
                pass

        elif data.startswith("ver_"):
            proyecto_id = data.replace("ver_", "", 1)
            res_t = supabase.table("tasks").select("title, status").eq("project_id", proyecto_id).execute()
            lista = "\n".join([f"• [{t['status']}] {t['title']}" for t in res_t.data])
            bot.send_message(call.message.chat.id, f"📝 *Tareas:*\n\n{lista or 'Sin tareas'}", parse_mode="Markdown")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Bot corriendo con estados: idea, en progreso, completado...")
    bot.infinity_polling()