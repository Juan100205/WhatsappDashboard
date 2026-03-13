import { safeArray } from "@/lib/utils";

describe("safeArray", () => {
  it("devuelve el array original si es un array válido", () => {
    expect(safeArray([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("devuelve [] si recibe un objeto de error { error: '...' }", () => {
    expect(safeArray({ error: "tabla no existe" })).toEqual([]);
  });

  it("devuelve [] si recibe null", () => {
    expect(safeArray(null)).toEqual([]);
  });

  it("devuelve [] si recibe undefined", () => {
    expect(safeArray(undefined)).toEqual([]);
  });

  it("devuelve [] si recibe un string", () => {
    expect(safeArray("unexpected string")).toEqual([]);
  });

  it("devuelve [] si recibe un número", () => {
    expect(safeArray(42)).toEqual([]);
  });

  it("preserva un array vacío como array vacío", () => {
    expect(safeArray([])).toEqual([]);
  });
});
