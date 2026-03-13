"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Mic, Bot } from "lucide-react";
import { timeAgo, cn, safeArray } from "@/lib/utils";
import type { Client, Message } from "@/types";

// ─── Burbujas ─────────────────────────────────────────────────────
function AudioBubble({ message, isNew }: { message: Message; isNew: boolean }) {
  const [open, setOpen] = useState(false);
  const isUser = message.role === "user";
  return (
    <div className={cn("flex mb-3", isUser ? "justify-start" : "justify-end", isNew ? "animate-bounce-in" : "animate-fade-in-up")}>
      <div className="max-w-[75%] space-y-1">
        <div className={cn("rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3",
          isUser ? "bg-white rounded-tl-none" : "bg-primary-300 rounded-tr-none text-gray-900"
        )}>
          <Mic className={cn("w-4 h-4", isUser ? "text-primary-500" : "text-gray-700")} />
          <span className="text-sm font-medium">Audio • 0:23</span>
        </div>
        {message.transcription && (
          <div className="bg-gray-100 rounded-xl px-3 py-2 max-w-xs">
            <button onClick={() => setOpen(!open)} className="text-xs text-gray-500 flex items-center gap-1 w-full hover:text-gray-700 transition-colors">
              <span>{open ? "▲" : "▼"}</span> Transcripción
            </button>
            {open && <p className="mt-1.5 text-sm text-gray-700 italic animate-fade-in">"{message.transcription}"</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function TextBubble({ message, isNew }: { message: Message; isNew: boolean }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex mb-3", isUser ? "justify-start" : "justify-end", isNew ? "animate-bounce-in" : "animate-fade-in-up")}>
      <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-sm",
        isUser ? "bg-white rounded-tl-none text-gray-800" : "bg-primary-300 rounded-tr-none text-gray-900"
      )}>
        <p>{message.message}</p>
        <div className="flex items-center justify-end gap-1.5 mt-1">
          <span className={cn("text-xs", isUser ? "text-gray-400" : "text-gray-600")}>
            {new Date(message.timestamp).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {!isUser && <Bot className="w-3 h-3 text-gray-600" />}
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────
export default function ConversationsPage() {
  const [clients, setClients]       = useState<Client[]>([]);
  const [selected, setSelected]     = useState<Client | null>(null);
  const [messages, setMessages]     = useState<Message[]>([]);
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [newClientIds, setNewClientIds] = useState<Set<string>>(new Set());
  const [newMsgIds, setNewMsgIds]   = useState<Set<string>>(new Set());

  const clientIdsRef  = useRef<Set<string>>(new Set());
  const msgIdsRef     = useRef<Set<string>>(new Set());
  const selectedRef   = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  selectedRef.current = selected;

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Fetch clientes ────────────────────────────────────────────
  const fetchClients = useCallback(async () => {
    try {
      const res  = await fetch("/api/clients");
      const data = await res.json();
      const list = safeArray<Client>(data);

      const incoming  = new Set(list.map(c => c.id));
      const freshIds  = list.filter(c => !clientIdsRef.current.has(c.id)).map(c => c.id);

      if (freshIds.length > 0) {
        setNewClientIds(prev => new Set(Array.from(prev).concat(freshIds)));
        // Limpiar highlight después de 3s
        setTimeout(() => setNewClientIds(prev => {
          const next = new Set(prev);
          freshIds.forEach(id => next.delete(id));
          return next;
        }), 3000);
      }

      clientIdsRef.current = incoming;
      setClients(list);

      // Auto-seleccionar primer cliente si no hay ninguno seleccionado
      if (!selectedRef.current && list.length > 0) {
        setSelected(list[0]);
      }
    } catch {/* silencioso */}
    finally { setLoading(false); }
  }, []);

  // ─── Fetch mensajes ────────────────────────────────────────────
  const fetchMessages = useCallback(async () => {
    const current = selectedRef.current;
    if (!current) return;
    try {
      const res  = await fetch(`/api/messages?phone=${encodeURIComponent(current.phone)}`);
      const data = await res.json();
      const list = safeArray<Message>(data);

      const freshIds = list.filter(m => !msgIdsRef.current.has(m.id)).map(m => m.id);

      if (freshIds.length > 0) {
        msgIdsRef.current = new Set(list.map(m => m.id));
        setNewMsgIds(prev => new Set(Array.from(prev).concat(freshIds)));
        setTimeout(() => setNewMsgIds(prev => {
          const next = new Set(prev);
          freshIds.forEach(id => next.delete(id));
          return next;
        }), 2000);
      }

      setMessages(list);
    } catch {/* silencioso */}
  }, []);

  // ─── Polling ────────────────────────────────────────────────────
  useEffect(() => {
    fetchClients();
    const t = setInterval(fetchClients, 4000);
    return () => clearInterval(t);
  }, [fetchClients]);

  useEffect(() => {
    if (!selected) return;
    msgIdsRef.current = new Set();
    fetchMessages();
    const t = setInterval(fetchMessages, 3000);
    return () => clearInterval(t);
  }, [selected, fetchMessages]);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="flex h-full">
      {/* Panel izquierdo */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col flex-shrink-0 animate-slide-in-left">
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-gray-900">Conversaciones</h1>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="En vivo" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-shadow duration-150"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Cargando...</div>}
          {!loading && filtered.length === 0 && <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Sin conversaciones</div>}
          {filtered.map((client, i) => {
            const active  = selected?.id === client.id;
            const isNew   = newClientIds.has(client.id);
            return (
              <button key={client.id} onClick={() => setSelected(client)}
                style={{ animationDelay: `${i * 40}ms` }}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 text-left transition-all duration-300",
                  active  ? "bg-primary-50 border-l-2 border-l-primary-400" : "hover:bg-gray-50",
                  isNew   ? "animate-bounce-in ring-1 ring-green-300 bg-green-50" : "animate-fade-in"
                )}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {client.name[0]}
                  </div>
                  {isNew && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-ping" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 text-sm truncate">{client.name}</p>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{timeAgo(client.last_interaction)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{client.message_count ?? 0} mensajes</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 flex flex-col bg-gray-50 min-w-0 animate-fade-in">
        {selected ? (
          <>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center text-white font-bold">
                {selected.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selected.name}</p>
                <p className="text-sm text-gray-500">{selected.phone}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full font-medium">
                  {selected.message_count ?? 0} mensajes
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  Última: {timeAgo(selected.last_interaction)}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-fade-in">
                  <EmptyIcon />
                  <p className="mt-3 text-sm">No hay mensajes aún</p>
                </div>
              ) : (
                <>
                  {messages.map(msg =>
                    msg.type === "audio"
                      ? <AudioBubble key={msg.id} message={msg} isNew={newMsgIds.has(msg.id)} />
                      : <TextBubble  key={msg.id} message={msg} isNew={newMsgIds.has(msg.id)} />
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-fade-in">
            <EmptyIcon />
            <p className="mt-3 text-sm">Selecciona una conversación</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyIcon() {
  return (
    <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
