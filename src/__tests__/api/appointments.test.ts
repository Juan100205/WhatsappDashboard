const mockInsert  = jest.fn();
const mockSelect  = jest.fn();
const mockOrder   = jest.fn();
const mockFrom    = jest.fn();

jest.mock("@/lib/supabase", () => ({
  supabase: { from: mockFrom },
}));

import { GET, POST } from "@/app/api/appointments/route";
import { NextRequest } from "next/server";

describe("GET /api/appointments", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devuelve array de citas con datos del cliente aplanados", async () => {
    const mockData = [
      {
        id: "a1", client_id: "1", date: "2024-12-19T15:00:00Z",
        status: "scheduled", calendar_event_id: "gcal_001", notes: "Visita",
        clients: { name: "Juan García", phone: "+573001234567" },
      },
    ];
    mockFrom.mockReturnValue({ select: () => ({ order: () => Promise.resolve({ data: mockData, error: null }) }) });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0].client_name).toBe("Juan García");
    expect(body[0].client_phone).toBe("+573001234567");
    expect(body[0]).not.toHaveProperty("clients"); // debe estar aplanado
  });

  it("devuelve 500 si Supabase falla", async () => {
    mockFrom.mockReturnValue({ select: () => ({ order: () => Promise.resolve({ data: null, error: { message: "DB error" } }) }) });

    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("POST /api/appointments", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devuelve 400 si faltan campos requeridos", async () => {
    const req = new NextRequest("http://localhost:3000/api/appointments", {
      method: "POST",
      body: JSON.stringify({ notes: "sin client_id ni date" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("crea la cita y devuelve 201", async () => {
    const newApt = { id: "a99", client_id: "1", date: "2025-01-10T10:00:00Z", notes: "", calendar_event_id: "" };
    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: newApt, error: null }) }) }) };
      }
      return { insert: () => Promise.resolve({ data: null, error: null }) };
    });

    const req = new NextRequest("http://localhost:3000/api/appointments", {
      method: "POST",
      body: JSON.stringify({ client_id: "1", date: "2025-01-10T10:00:00Z", client_phone: "+573001234567" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.id).toBe("a99");
  });
});
