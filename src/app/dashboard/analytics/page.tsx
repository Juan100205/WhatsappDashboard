"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { MessageSquare, Mic, Calendar, Users, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AnalyticsData {
  clients:      number;
  appointments: number;
  audios:       number;
  messages:     number;
  dailyMetrics: { date: string; messages_received: number; messages_sent: number; appointments: number }[];
  recentEvents: { id: string; type: string; client_phone: string; timestamp: string }[];
}

const EVENT_LABELS: Record<string, string> = {
  message_received:    "📨 Mensaje recibido",
  message_sent:        "📤 Respuesta enviada",
  audio_transcribed:   "🎤 Audio transcrito",
  appointment_created: "📅 Cita creada",
};

export default function AnalyticsPage() {
  const [data, setData]     = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm animate-fade-in">
        Cargando analítica...
      </div>
    );
  }

  if (!data) return null;

  const metrics = [
    { label: "Conversaciones",    value: data.clients,      icon: <Users className="w-5 h-5" />,       color: "text-blue-600",    bg: "bg-blue-50",    delta: null },
    { label: "Mensajes recibidos",value: data.messages,     icon: <MessageSquare className="w-5 h-5" />,color: "text-primary-600", bg: "bg-primary-50", delta: null },
    { label: "Audios transcritos",value: data.audios,       icon: <Mic className="w-5 h-5" />,          color: "text-purple-600",  bg: "bg-purple-50",  delta: null },
    { label: "Citas creadas",     value: data.appointments, icon: <Calendar className="w-5 h-5" />,     color: "text-orange-600",  bg: "bg-orange-50",  delta: null },
  ];

  const chartData = data.dailyMetrics.map(d => ({
    ...d,
    date: format(new Date(d.date), "EEE d", { locale: es }),
  }));

  return (
    <div className="h-full overflow-y-auto px-8 py-6 animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analítica</h1>
        <p className="text-gray-500 text-sm mt-1">Métricas de los últimos 7 días</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => (
          <div key={m.label} style={{ animationDelay: `${i * 60}ms` }}
            className="card-hover animate-fade-in-up bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center`}>
                {m.icon}
              </div>
              <span className="text-sm font-medium text-primary-500 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Live
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{m.value}</p>
            <p className="text-sm text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card-hover animate-fade-in-up bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" style={{ animationDelay: "200ms" }}>
          <h2 className="font-semibold text-gray-900 mb-4">Mensajes por día</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="messages_received" name="Recibidos" fill="#67ddfa" radius={[4,4,0,0]} />
              <Bar dataKey="messages_sent"     name="Enviados"  fill="#a1edfb" radius={[4,4,0,0]} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-hover animate-fade-in-up bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" style={{ animationDelay: "260ms" }}>
          <h2 className="font-semibold text-gray-900 mb-4">Citas agendadas</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="appointments" name="Citas" stroke="#f97316" strokeWidth={2.5} dot={{ fill: "#f97316", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card-hover animate-fade-in-up bg-white rounded-2xl p-6 border border-gray-100 shadow-sm col-span-2" style={{ animationDelay: "320ms" }}>
          <h2 className="font-semibold text-gray-900 mb-4">Actividad reciente</h2>
          {data.recentEvents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin actividad aún — los eventos aparecerán cuando lleguen mensajes de WhatsApp</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {data.recentEvents.map((event, i) => (
                <div key={event.id}
                  style={{ animationDelay: `${320 + i * 40}ms` }}
                  className="animate-fade-in flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                  <span className="text-sm text-gray-700">{EVENT_LABELS[event.type] ?? event.type}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="font-mono">{event.client_phone}</span>
                    <span>{new Date(event.timestamp).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
