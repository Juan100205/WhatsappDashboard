"use client";
import { useState, useEffect } from "react";
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, List, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, cn, safeArray } from "@/lib/utils";
import type { Appointment, AppointmentStatus } from "@/types";

const statusConfig: Record<AppointmentStatus, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
  scheduled: {
    label: "Programada",
    color: "bg-blue-50 text-blue-700 border border-blue-200",
    dot:   "bg-blue-500",
    icon:  <AlertCircle className="w-3.5 h-3.5" />,
  },
  completed: {
    label: "Completada",
    color: "bg-primary-50 text-primary-700 border border-primary-200",
    dot:   "bg-primary-500",
    icon:  <CheckCircle className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: "Cancelada",
    color: "bg-red-50 text-red-700 border border-red-200",
    dot:   "bg-red-500",
    icon:  <XCircle className="w-3.5 h-3.5" />,
  },
};

type Filter = "all" | AppointmentStatus;
type View   = "list" | "calendar";

const DAYS   = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<Filter>("all");
  const [view, setView]       = useState<View>("list");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear,  setCalYear]  = useState(now.getFullYear());

  useEffect(() => {
    fetch("/api/appointments")
      .then(r => r.json())
      .then((data: unknown) => setAppointments(safeArray<Appointment>(data)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter(a => filter === "all" || a.status === filter);

  const counts = {
    all:       appointments.length,
    scheduled: appointments.filter(a => a.status === "scheduled").length,
    completed: appointments.filter(a => a.status === "completed").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length,
  };

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const aptsByDay: Record<string, Appointment[]> = {};
  appointments.forEach(apt => {
    const d = new Date(apt.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    if (!aptsByDay[key]) aptsByDay[key] = [];
    aptsByDay[key].push(apt);
  });

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1);
    setSelectedDay(null);
  };

  const selectedApts = selectedDay ? (aptsByDay[selectedDay] ?? []) : [];

  return (
    <div className="h-full overflow-y-auto px-8 py-6 animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
          <p className="text-gray-500 text-sm mt-1">Visitas agendadas desde Google Calendar</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(["list","calendar"] as View[]).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                view === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}>
              {v === "list" ? <List className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
              {v === "list" ? "Lista" : "Calendario"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { key: "all",       label: "Total",       border: filter === "all"       ? "border-gray-400"    : "border-gray-100" },
          { key: "scheduled", label: "Programadas", border: filter === "scheduled" ? "border-blue-400"    : "border-gray-100" },
          { key: "completed", label: "Completadas", border: filter === "completed" ? "border-primary-400" : "border-gray-100" },
          { key: "cancelled", label: "Canceladas",  border: filter === "cancelled" ? "border-red-400"     : "border-gray-100" },
        ].map(({ key, label, border }, i) => (
          <button key={key} onClick={() => setFilter(key as Filter)}
            style={{ animationDelay: `${i * 60}ms` }}
            className={cn("card-hover animate-fade-in-up bg-white rounded-2xl p-4 border-2 transition-all duration-200 text-left shadow-sm", border)}>
            <p className="text-3xl font-bold text-gray-900">{counts[key as Filter]}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Cargando citas...</div>
      )}

      {/* LIST VIEW */}
      {!loading && view === "list" && (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No hay citas para este filtro</div>
          )}
          {filtered.map((apt, i) => {
            const status = statusConfig[apt.status];
            return (
              <div key={apt.id} style={{ animationDelay: `${i * 60}ms` }}
                className="card-hover animate-fade-in-up bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {apt.client_name?.[0] ?? "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{apt.client_name}</p>
                        <span className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", status.color)}>
                          {status.icon}{status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(apt.date)}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date(apt.date).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{apt.client_phone}</span>
                      </div>
                      {apt.notes && (
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5">📝 {apt.notes}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{apt.calendar_event_id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {!loading && view === "calendar" && (
        <div className="animate-scale-in bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-primary-50 transition-colors duration-150">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-base font-semibold text-gray-900">{MONTHS[calMonth]} {calYear}</h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-primary-50 transition-colors duration-150">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-7 border-b border-gray-100">
            {DAYS.map(d => (
              <div key={d} className="py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wide">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} className="min-h-[80px] border-r border-b border-gray-50 bg-gray-50/50" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day     = i + 1;
              const key     = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const dayApts = (aptsByDay[key] ?? []).filter(a => filter === "all" || a.status === filter);
              const isSel   = selectedDay === key;
              const isLast  = (firstDay + i) % 7 === 6;
              return (
                <div key={key}
                  onClick={() => dayApts.length > 0 && setSelectedDay(isSel ? null : key)}
                  className={cn(
                    "min-h-[80px] border-b border-gray-100 p-2 transition-colors duration-150",
                    !isLast && "border-r",
                    isSel ? "bg-primary-50" : dayApts.length > 0 ? "hover:bg-primary-50/50 cursor-pointer" : "cursor-default"
                  )}>
                  <span className={cn(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 transition-all duration-200",
                    isSel ? "bg-primary-400 text-white" : "text-gray-700"
                  )}>{day}</span>
                  <div className="space-y-0.5">
                    {dayApts.slice(0, 2).map(apt => (
                      <div key={apt.id} className={cn("flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md truncate", statusConfig[apt.status].color)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", statusConfig[apt.status].dot)} />
                        <span className="truncate">{apt.client_name}</span>
                      </div>
                    ))}
                    {dayApts.length > 2 && <p className="text-xs text-gray-400 px-1.5">+{dayApts.length - 2} más</p>}
                  </div>
                </div>
              );
            })}
          </div>
          {selectedDay && selectedApts.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-4 animate-fade-in-up">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {new Date(selectedDay + "T12:00:00").toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
              </h3>
              <div className="space-y-2">
                {selectedApts.map(apt => {
                  const status = statusConfig[apt.status];
                  return (
                    <div key={apt.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 hover:bg-primary-50 transition-colors duration-150">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {apt.client_name?.[0] ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 text-sm">{apt.client_name}</p>
                          <span className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", status.color)}>
                            {status.icon}{status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(apt.date).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</span>
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{apt.client_phone}</span>
                        </div>
                        {apt.notes && <p className="text-xs text-gray-500 mt-1 truncate">📝 {apt.notes}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
