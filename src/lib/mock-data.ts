import type { Client, Message, Appointment, AnalyticsEvent, DailyMetric } from "@/types";

export const mockClients: Client[] = [
  { id: "1", name: "Juan García", phone: "+573001234567", created_at: "2024-11-01T10:00:00Z", last_interaction: "2024-12-15T14:32:00Z", message_count: 24 },
  { id: "2", name: "María López", phone: "+573009876543", created_at: "2024-11-10T09:00:00Z", last_interaction: "2024-12-15T09:15:00Z", message_count: 12 },
  { id: "3", name: "Carlos Ruiz", phone: "+573005551234", created_at: "2024-11-20T11:00:00Z", last_interaction: "2024-12-14T16:45:00Z", message_count: 8 },
  { id: "4", name: "Ana Martínez", phone: "+573007778899", created_at: "2024-12-01T08:00:00Z", last_interaction: "2024-12-13T11:20:00Z", message_count: 31 },
  { id: "5", name: "Pedro Sánchez", phone: "+573002223344", created_at: "2024-12-05T14:00:00Z", last_interaction: "2024-12-12T17:00:00Z", message_count: 5 },
];

export const mockMessages: Record<string, Message[]> = {
  "+573001234567": [
    { id: "m1", client_id: "1", role: "user", type: "text", message: "Hola, buenas tardes. Quiero información sobre apartamentos en arriendo.", timestamp: "2024-12-15T14:00:00Z" },
    { id: "m2", client_id: "1", role: "assistant", type: "text", message: "¡Hola Juan! Claro, con gusto te ayudo. ¿En qué zona de la ciudad estás buscando?", timestamp: "2024-12-15T14:00:30Z" },
    { id: "m3", client_id: "1", role: "user", type: "text", message: "En el norte, cerca de la calle 100", timestamp: "2024-12-15T14:01:00Z" },
    { id: "m4", client_id: "1", role: "assistant", type: "text", message: "Perfecto, tenemos varias opciones disponibles en esa zona. ¿Cuántas habitaciones necesitas?", timestamp: "2024-12-15T14:01:20Z" },
    { id: "m5", client_id: "1", role: "user", type: "audio", message: "", audio_url: "/mock-audio.mp3", transcription: "Necesito un apartamento de dos habitaciones, preferiblemente con parqueadero y que no supere el millón doscientos.", timestamp: "2024-12-15T14:02:00Z" },
    { id: "m6", client_id: "1", role: "assistant", type: "text", message: "Entendido. Tengo un apartamento de 2 habitaciones en la calle 97 con carrera 15, parqueadero incluido, por $1.180.000. ¿Te gustaría agendar una visita?", timestamp: "2024-12-15T14:02:30Z" },
    { id: "m7", client_id: "1", role: "user", type: "text", message: "Sí, me interesa. ¿Puedo verlo el jueves?", timestamp: "2024-12-15T14:03:00Z" },
    { id: "m8", client_id: "1", role: "assistant", type: "text", message: "Por supuesto. He agendado tu visita para el jueves 19 de diciembre a las 3:00 PM. Recibirás una confirmación en tu calendario.", timestamp: "2024-12-15T14:03:30Z" },
  ],
  "+573009876543": [
    { id: "m9", client_id: "2", role: "user", type: "text", message: "Buenos días, ¿tienen casas disponibles en Chapinero?", timestamp: "2024-12-15T09:00:00Z" },
    { id: "m10", client_id: "2", role: "assistant", type: "text", message: "¡Buenos días María! Sí, tenemos algunas opciones en Chapinero. ¿Cuál es tu presupuesto aproximado?", timestamp: "2024-12-15T09:00:45Z" },
    { id: "m11", client_id: "2", role: "user", type: "audio", message: "", audio_url: "/mock-audio.mp3", transcription: "Mi presupuesto es de dos millones de pesos. Necesito mínimo tres habitaciones y patio o terraza.", timestamp: "2024-12-15T09:01:30Z" },
    { id: "m12", client_id: "2", role: "assistant", type: "text", message: "Tengo justo lo que buscas. Una casa de 3 habitaciones con terraza en Chapinero Alto por $1.950.000. ¿Agendamos una visita?", timestamp: "2024-12-15T09:02:00Z" },
  ],
  "+573005551234": [
    { id: "m13", client_id: "3", role: "user", type: "text", message: "Hola, vi su anuncio en internet. ¿El apartamento de la 72 sigue disponible?", timestamp: "2024-12-14T16:40:00Z" },
    { id: "m14", client_id: "3", role: "assistant", type: "text", message: "¡Hola Carlos! Sí, ese apartamento sigue disponible. ¿Quieres que te cuente más detalles?", timestamp: "2024-12-14T16:40:30Z" },
    { id: "m15", client_id: "3", role: "user", type: "text", message: "Sí por favor", timestamp: "2024-12-14T16:41:00Z" },
  ],
};

export const mockAppointments: Appointment[] = [
  { id: "a1", client_id: "1", client_name: "Juan García", client_phone: "+573001234567", date: "2024-12-19T15:00:00Z", status: "scheduled", calendar_event_id: "gcal_001", notes: "Visita apartamento calle 97 #15-32. 2 hab, parqueadero." },
  { id: "a2", client_id: "2", client_name: "María López", client_phone: "+573009876543", date: "2024-12-18T10:00:00Z", status: "scheduled", calendar_event_id: "gcal_002", notes: "Visita casa Chapinero Alto. 3 hab, terraza." },
  { id: "a3", client_id: "4", client_name: "Ana Martínez", client_phone: "+573007778899", date: "2024-12-10T14:00:00Z", status: "completed", calendar_event_id: "gcal_003", notes: "Visita apartamento Rosales. Cliente interesada." },
  { id: "a4", client_id: "5", client_name: "Pedro Sánchez", client_phone: "+573002223344", date: "2024-12-12T09:00:00Z", status: "cancelled", calendar_event_id: "gcal_004", notes: "No confirmó asistencia." },
  { id: "a5", client_id: "3", client_name: "Carlos Ruiz", client_phone: "+573005551234", date: "2024-12-20T11:00:00Z", status: "scheduled", calendar_event_id: "gcal_005", notes: "Visita apartamento calle 72." },
];

export const mockEvents: AnalyticsEvent[] = [
  { id: "e1", type: "message_received", client_phone: "+573001234567", timestamp: "2024-12-15T14:00:00Z" },
  { id: "e2", type: "message_sent", client_phone: "+573001234567", timestamp: "2024-12-15T14:00:30Z" },
  { id: "e3", type: "audio_transcribed", client_phone: "+573001234567", timestamp: "2024-12-15T14:02:00Z" },
  { id: "e4", type: "appointment_created", client_phone: "+573001234567", timestamp: "2024-12-15T14:03:30Z" },
  { id: "e5", type: "message_received", client_phone: "+573009876543", timestamp: "2024-12-15T09:00:00Z" },
  { id: "e6", type: "audio_transcribed", client_phone: "+573009876543", timestamp: "2024-12-15T09:01:30Z" },
  { id: "e7", type: "appointment_created", client_phone: "+573009876543", timestamp: "2024-12-15T09:02:00Z" },
];

export const mockDailyMetrics: DailyMetric[] = [
  { date: "2024-12-09", messages_received: 12, messages_sent: 11, appointments: 1 },
  { date: "2024-12-10", messages_received: 18, messages_sent: 17, appointments: 2 },
  { date: "2024-12-11", messages_received: 9, messages_sent: 8, appointments: 0 },
  { date: "2024-12-12", messages_received: 22, messages_sent: 21, appointments: 3 },
  { date: "2024-12-13", messages_received: 15, messages_sent: 14, appointments: 1 },
  { date: "2024-12-14", messages_received: 28, messages_sent: 26, appointments: 2 },
  { date: "2024-12-15", messages_received: 19, messages_sent: 18, appointments: 2 },
];
