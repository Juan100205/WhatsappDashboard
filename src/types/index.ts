export interface Client {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  last_interaction: string;
  message_count?: number;
}

export type MessageRole = "user" | "assistant";
export type MessageType = "text" | "audio";

export interface Message {
  id: string;
  client_id: string;
  role: MessageRole;
  type: MessageType;
  message: string;
  audio_url?: string;
  transcription?: string;
  timestamp: string;
}

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  client_id: string;
  client_name?: string;
  client_phone?: string;
  date: string;
  status: AppointmentStatus;
  calendar_event_id: string;
  notes: string;
}

export type EventType =
  | "message_received"
  | "message_sent"
  | "audio_transcribed"
  | "appointment_created";

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  client_phone: string;
  timestamp: string;
}

export interface DailyMetric {
  date: string;
  messages_received: number;
  messages_sent: number;
  appointments: number;
}
