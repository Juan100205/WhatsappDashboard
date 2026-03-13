"use client";
import { useState, useEffect } from "react";
import { Search, MessageSquare, Calendar } from "lucide-react";
import { formatDateTime, safeArray } from "@/lib/utils";
import type { Client } from "@/types";

import Link from "next/link";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then(r => r.json())
      .then((data: unknown) => setClients(safeArray<Client>(data)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="h-full overflow-y-auto px-8 py-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 text-sm mt-1">{clients.length} clientes registrados</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-shadow duration-150"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-scale-in">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Cliente","Teléfono","Registrado","Última interacción","Mensajes","Acciones"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">Cargando clientes...</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No se encontraron clientes</td>
              </tr>
            )}
            {filtered.map((client, i) => (
              <tr key={client.id}
                style={{ animationDelay: `${i * 50}ms` }}
                className="animate-fade-in border-b border-gray-50 hover:bg-primary-50 transition-colors duration-150">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {client.name[0]}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{client.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(client.created_at)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(client.last_interaction)}</td>
                <td className="px-6 py-4">
                  <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {client.message_count ?? 0}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link href="/dashboard/conversations"
                      className="p-1.5 hover:bg-primary-50 text-gray-400 hover:text-primary-600 rounded-lg transition-colors duration-150" title="Ver conversación">
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                    <Link href="/dashboard/appointments"
                      className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors duration-150" title="Ver citas">
                      <Calendar className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
