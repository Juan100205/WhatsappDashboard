/**
 * Tests para GET /api/clients
 * Usa mocks de Supabase para no necesitar conexión real.
 */

// Mock del módulo supabase antes de importar la route
const mockSelect = jest.fn();
const mockOrder  = jest.fn();
const mockFrom   = jest.fn(() => ({ select: mockSelect }));

jest.mock("@/lib/supabase", () => ({
  supabase: { from: mockFrom },
}));

import { GET } from "@/app/api/clients/route";

describe("GET /api/clients", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devuelve 200 con array de clientes cuando Supabase responde OK", async () => {
    const mockClients = [
      { id: "1", name: "Juan García", phone: "+573001234567", created_at: "2024-12-01T00:00:00Z", last_interaction: "2024-12-15T00:00:00Z", message_count: 5 },
    ];
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: mockClients, error: null });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(1);
    expect(body[0].name).toBe("Juan García");
  });

  it("devuelve 500 con mensaje de error cuando Supabase falla", async () => {
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: null, error: { message: "relation does not exist" } });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toHaveProperty("error");
    expect(body.error).toContain("relation does not exist");
  });

  it("devuelve array vacío cuando no hay clientes", async () => {
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: [], error: null });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual([]);
  });
});
