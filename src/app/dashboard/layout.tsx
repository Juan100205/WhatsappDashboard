"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageSquare, Users, Calendar, BarChart2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Conversaciones", href: "/dashboard/conversations", icon: MessageSquare },
  { label: "Clientes",       href: "/dashboard/clients",       icon: Users },
  { label: "Citas",          href: "/dashboard/appointments",  icon: Calendar },
  { label: "Analítica",      href: "/dashboard/analytics",     icon: BarChart2 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center px-6 py-5 border-b border-gray-100">
          <Image
            src="/logo.png"
            alt="Vecino Alquila"
            width={160}
            height={48}
            className="object-contain"
            priority
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 stagger">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={cn(
                  "nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium animate-slide-in-left",
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-colors duration-150", active ? "text-primary-500" : "text-gray-400")} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-100 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-700">A</div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">admin@vecinoalquila.co</p>
            </div>
          </div>
          <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-150">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
