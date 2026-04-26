"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const roleLabels = {
  guest: "Belum Login",
  admin: "Admin",
  organizer: "Organizer",
  customer: "Customer",
};

const navItems = {
  guest: {
    main: [
      { label: "Login", href: "/login" },
      { label: "Registrasi", href: "/register" },
    ],
    sub: []
  },
  admin: {
    main: [
      { label: "Acara Saya", href: "/events" },
      { label: "Manajemen Venue", href: "/venues" },
      { label: "Manajemen Kursi", href: "#" },
      { label: "Kategori Tiket", href: "#" },
      { label: "Manajemen Tiket", href: "#" },
      { label: "Semua Order", href: "#" },
    ],
    sub: [
      { label: "Tiket", badge: "Aset", href: "#" },
      { label: "Order", badge: "Aset", href: "#" },
      { label: "Profile", href: "#" },
    ]
  },
  organizer: {
    main: [
      { label: "Acara Saya", href: "/events" },
      { label: "Manajemen Venue", href: "/venues" },
      { label: "Manajemen Kursi", href: "#" },
      { label: "Kategori Tiket", href: "#" },
      { label: "Manajemen Tiket", href: "#" },
      { label: "Semua Order", href: "#" },
    ],
    sub: [
      { label: "Tiket", badge: "Aset", href: "#" },
      { label: "Order", badge: "Aset", href: "#" },
      { label: "Profile", href: "#" },
    ]
  },
  customer: {
    main: [
      { label: "Jelajahi Acara", href: "/events" },
      { label: "Venue", href: "/venues" },
      { label: "Artis", href: "#" },
      { label: "Promosi", href: "#" },
    ],
    sub: [
      { label: "Tiket Saya", href: "#" },
      { label: "Pesanan", href: "#" },
      { label: "Logout", href: "/login" },
    ]
  },
};

export default function Navbar({ mode = "dashboard" }) {
  const [role, setRole] = useState("admin");
  const pathname = usePathname();

  const activeRole = mode === "public" ? "guest" : role;
  const items = useMemo(() => navItems[activeRole] ?? navItems.guest, [activeRole]);

  useEffect(() => {
    if (mode === "public") return;
    const savedRole = window.localStorage.getItem("basdead-role");
    if (savedRole && roleLabels[savedRole]) {
      setRole(savedRole);
    }
  }, [mode]);

  function handleRoleChange(nextRole) {
    setRole(nextRole);
    window.localStorage.setItem("basdead-role", nextRole);
    window.dispatchEvent(new CustomEvent("basdead-role-change", { detail: nextRole }));
  }

  return (
    <nav className="sticky top-0 z-50 overflow-hidden border-b border-[#8b5cf6]/20 bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040] px-4 md:px-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_50%,rgba(139,92,246,0.1)_0%,transparent_55%),radial-gradient(ellipse_at_85%_50%,rgba(59,130,246,0.07)_0%,transparent_55%)]"></div>
      
      {/* Top Row */}
      <div className="relative flex h-[58px] items-center border-b border-white/5">
        <div className="mr-9 flex shrink-0 items-center gap-3">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-[13px] font-bold tracking-tight text-white shadow-[0_0_18px_rgba(139,92,246,0.45),0_2px_6px_rgba(0,0,0,0.4)] transition-shadow hover:shadow-[0_0_26px_rgba(139,92,246,0.65),0_2px_8px_rgba(0,0,0,0.4)] cursor-default select-none">
            TT
          </div>
          <div className="flex flex-col leading-none cursor-default select-none">
            <span className="text-[15px] font-bold tracking-tight text-white">TikTakTuk</span>
            <span className="mt-[3px] text-[9px] font-semibold uppercase tracking-[1.6px] text-[#a78bfa]">
              Platform Tiket
            </span>
          </div>
        </div>

        <div className="no-scrollbar flex flex-1 items-center gap-0.5 overflow-x-auto">
          {items.main.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative shrink-0 whitespace-nowrap rounded-lg border px-[13px] py-[7px] text-[13px] font-medium transition-colors ${
                  isActive
                    ? "border-[#8b5cf6]/40 bg-[#8b5cf6]/20 text-white"
                    : "border-transparent text-white/55 hover:border-[#8b5cf6]/25 hover:bg-[#8b5cf6]/10 hover:text-white/90"
                }`}
              >
                {item.label}
                {isActive && (
                  <div className="absolute -bottom-[2px] left-1/2 h-[2px] w-[55%] -translate-x-1/2 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.9)]"></div>
                )}
              </Link>
            );
          })}
        </div>

        {mode !== "public" && (
          <div className="ml-4 shrink-0">
            <div className="group relative flex cursor-pointer select-none items-center gap-[7px] rounded-full border border-white/10 bg-white/5 py-[5px] pl-3 pr-2 transition-colors hover:border-[#8b5cf6]/30 hover:bg-[#8b5cf6]/10">
              <span className="text-[10.5px] tracking-wide text-white/35">View as</span>
              <select
                value={role}
                onChange={(event) => handleRoleChange(event.target.value)}
                className="absolute inset-0 cursor-pointer appearance-none bg-transparent opacity-0"
              >
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value} className="text-slate-900">
                    {label}
                  </option>
                ))}
              </select>
              <span className="text-[12.5px] font-semibold text-white">{roleLabels[role]}</span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8b5cf6]/20 text-[11px] text-[#a78bfa]">
                ▾
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row */}
      {items.sub.length > 0 && (
        <div className="relative flex h-[42px] items-center gap-[2px] overflow-x-auto no-scrollbar">
          {items.sub.map((item, index) => (
            <div key={item.label} className="flex items-center">
              <Link
                href={item.href}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[12px] font-medium text-white/35 transition-colors hover:bg-white/5 hover:text-white/80"
              >
                <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#8b5cf6]/55"></span>
                {item.label}
                {item.badge && (
                  <span className="ml-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#a78bfa] border border-[#8b5cf6]/20 bg-[#8b5cf6]/20">
                    {item.badge}
                  </span>
                )}
              </Link>
              {index < items.sub.length - 1 && (
                <div className="mx-1 h-[14px] w-px bg-white/5"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
