const mockSingle = jest.fn();
const mockEq     = jest.fn();
const mockSelect = jest.fn();
const mockOrder  = jest.fn();
const mockFrom   = jest.fn();

jest.mock("@/lib/supabase", () => ({
  supabase: { from: mockFrom },
}));

import { GET } from "@/app/api/messages/route";
import { NextRequest } from "next/server";

function makeReq(phone: string) {
  return new NextRequest(`http://localhost:3000/api/messages?phone=${encodeURIComponent(phone)}`);
}

describe("GET /api/messages", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devuelve 400 si no se pasa phone", async () => {
    const req = new NextRequest("http://localhost:3000/api/messages");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("devuelve [] si el cliente no existe", async () => {
    mockFrom.mockReturnValue({ select: () => ({ eq: () => ({ single: mockSingle }) }) });
    mockSingle.mockResolvedValue({ data: null, error: null });

    const res = await GET(makeReq("+573001234567"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual([]);
  });

  it("devuelve mensajes cuando el cliente existe", async () => {
    const mockMessages = [
      { id: "m1", client_id: "1", role: "user", type: "text", message: "Hola", timestamp: "2024-12-15T10:00:00Z" },
      { id: "m2", client_id: "1", role: "assistant", type: "text", message: "¡Hola!", timestamp: "2024-12-15T10:01:00Z" },
    ];

    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // Primera llamada: buscar cliente por phone
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { id: "1" }, error: null }) }) }) };
      }
      // Segunda llamada: buscar mensajes
      return { select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: mockMessages, error: null }) }) }) };
    });

    const res = await GET(makeReq("+573001234567"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(2);
    expect(body[0].role).toBe("user");
    expect(body[1].role).toBe("assistant");
  });
});
