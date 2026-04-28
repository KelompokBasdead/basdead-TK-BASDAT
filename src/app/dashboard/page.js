"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/Components/Navbar";

// ── Dummy data ────────────────────────────────────────────────────────────────
const DUMMY = {
  admin: {
    username: "admin1",
    totalPengguna: 12,
    totalAcara: 6,
    omzetPlatform: 3290000,
    promosiAktif: 6,
    venue: { total: 6, reservedSeating: 1, kapasitasTerbesar: 77000 },
    marketing: { promoPersentase: 4, promoNominal: 2, totalPenggunaan: 2 },
  },
  organizer: {
    username: "org_sound",
    namaOrganizer: "Soundrenaline",
    acaraAktif: 2,
    tiketTerjual: 20,
    revenue: 3290000,
    venueMitra: 6,
    events: [
      { judul: "Konser Melodi Senja", venue: "Jakarta Convention Center", sold: 85 },
      { judul: "Rock Legends Tour", venue: "JIExpo Kemayoran", sold: 72 },
    ],
  },
  customer: {
    username: "cust_budi",
    namaLengkap: "Budi Santoso",
    tiketAktif: 10,
    acaraDiikuti: 6,
    kodePromo: 6,
    totalBelanja: 3290000,
    tiketMendatang: [
      { judul: "Konser Melodi Senja", kategori: "VVIP", tanggal: "15 Mei 2024", venue: "Jakarta Convention Center" },
      { judul: "Malam Akustik Bandung", kategori: "VIP", tanggal: "10 Jun 2024", venue: "Bandung Hall Center" },
    ],
  },
};

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col gap-1 transition-all hover:border-purple-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</span>
        <span className="text-xl text-purple-400">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

// ── Event / Tiket Row ──────────────────────────────────────────────────────────
function ListRow({ title, badge, badgeColor = "bg-purple-100 text-purple-700", meta }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0 border-slate-100">
      <div>
        <p className="font-semibold text-slate-800 text-sm flex items-center gap-2">
          {title}
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {badge}
            </span>
          )}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{meta}</p>
      </div>
      <span className="text-slate-300 text-lg">›</span>
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
// AIRIN: tambah { onLogout } sebagai props untuk handle logout
function AdminDashboard({ onLogout }) {
  const d = DUMMY.admin;
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040] text-white rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">
            Administrator
          </p>
          <h2 className="text-2xl font-bold">System Console</h2>
          <p className="text-slate-400 text-sm mt-1">Pantau dan kelola platform TikTakTuk</p>
        </div>
        {/* AIRIN: tambah tombol Logout di samping tombol Promosi */}
        <div className="flex gap-2">
          <Link
            href="/promotions"
            className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Promosi
          </Link>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Pengguna" value={d.totalPengguna} sub="Pengguna terdaftar" icon="👥" />
        <StatCard label="Total Acara" value={d.totalAcara} sub="Event aktif" icon="📅" />
        <StatCard label="Omzet Platform" value={formatRupiah(d.omzetPlatform)} sub="Gross volume" icon="📈" />
        <StatCard label="Promosi Aktif" value={d.promosiAktif} sub="Running campaigns" icon="🎟️" />
      </div>
      {/* Cards bawah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-3 transition-all hover:border-purple-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Infrastruktur Venue</h3>
            <span className="text-purple-400 text-xs font-medium">↗</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Total Venue Terdaftar</span>
              <span className="font-semibold text-slate-800">{d.venue.total} Lokasi</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Reserved Seating</span>
              <span className="font-semibold text-slate-800">{d.venue.reservedSeating} Venue</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Kapasitas Terbesar</span>
              <span className="font-semibold text-slate-800">
                {d.venue.kapasitasTerbesar.toLocaleString("id-ID")} Kursi
              </span>
            </div>
          </div>
          <Link
            href="/venues"
            className="block w-full text-center border border-slate-200 text-slate-700 text-sm font-semibold py-2 rounded-lg hover:border-purple-300 hover:text-purple-600 transition"
          >
            Kelola Venue
          </Link>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-3 transition-all hover:border-purple-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Marketing & Promosi</h3>
            <span className="text-purple-400 text-xs font-medium">↗</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Promo Persentase</span>
              <span className="font-semibold text-purple-600">{d.marketing.promoPersentase} Aktif</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Promo Potongan Nominal</span>
              <span className="font-semibold text-purple-600">{d.marketing.promoNominal} Aktif</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Total Penggunaan</span>
              <span className="font-semibold text-slate-800">{d.marketing.totalPenggunaan} Kali</span>
            </div>
          </div>
          <Link
            href="/promotions"
            className="block w-full text-center border border-slate-200 text-slate-700 text-sm font-semibold py-2 rounded-lg hover:border-purple-300 hover:text-purple-600 transition"
          >
            Kelola Promosi
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Organizer Dashboard ───────────────────────────────────────────────────────
// AIRIN: tambah { onLogout } sebagai props untuk handle logout
function OrganizerDashboard({ onLogout }) {
  const d = DUMMY.organizer;
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040] text-white rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">
            Dashboard Penyelenggara
          </p>
          <h2 className="text-2xl font-bold">{d.namaOrganizer}</h2>
          <p className="text-slate-400 text-sm mt-1">Kelola {d.acaraAktif} acara aktif Anda</p>
        </div>
        {/* AIRIN: tambah tombol Logout */}
        <div className="flex gap-2">
          <Link
            href="/events"
            className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Kelola Acara
          </Link>
          <Link
            href="/venues"
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Venue
          </Link>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Acara Aktif" value={d.acaraAktif} sub="Dalam koordinasi" icon="📅" />
        <StatCard label="Tiket Terjual" value={d.tiketTerjual} sub="Total terjual" icon="🎫" />
        <StatCard label="Revenue" value={formatRupiah(d.revenue)} sub="Bulan ini" icon="📈" />
        <StatCard label="Venue Mitra" value={d.venueMitra} sub="Lokasi aktif" icon="📍" />
      </div>
      {/* Performa Acara */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-3 transition-all hover:border-purple-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">Performa Acara</h3>
            <p className="text-xs text-slate-400">Status acara yang Anda kelola</p>
          </div>
          <Link href="/events" className="text-xs font-semibold text-purple-500 hover:underline">
            Lihat Semua
          </Link>
        </div>
        <div>
          {d.events.map((ev, i) => (
            <ListRow
              key={i}
              title={ev.judul}
              badge="LIVE"
              badgeColor="bg-purple-100 text-purple-700"
              meta={`↗ ${ev.sold}% terjual · 📍 ${ev.venue}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Customer Dashboard ────────────────────────────────────────────────────────
// AIRIN: tambah { onLogout } sebagai props untuk handle logout
function CustomerDashboard({ onLogout }) {
  const d = DUMMY.customer;
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040] text-white rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-purple-400 mb-1">Selamat datang kembali</p>
          <h2 className="text-2xl font-bold">{d.namaLengkap}</h2>
          <p className="text-slate-400 text-sm mt-1">
            {d.tiketMendatang.length} acara menarik menunggu Anda
          </p>
        </div>
        {/* AIRIN: tambah tombol Logout */}
        <div className="flex gap-2">
          <Link
            href="/events"
            className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Cari Tiket
          </Link>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tiket Aktif" value={d.tiketAktif} sub="Siap digunakan" icon="🎫" />
        <StatCard label="Acara Diikuti" value={d.acaraDiikuti} sub="Total pengalaman" icon="📅" />
        <StatCard label="Kode Promo" value={d.kodePromo} sub="Tersedia untuk Anda" icon="🏷️" />
        <StatCard label="Total Belanja" value={formatRupiah(d.totalBelanja)} sub="Bulan ini" icon="🎵" />
      </div>
      {/* Tiket Mendatang */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-3 transition-all hover:border-purple-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">Tiket Mendatang</h3>
            <p className="text-xs text-slate-400">Tiket pertunjukan yang akan datang</p>
          </div>
          <Link href="/my-tickets" className="text-xs font-semibold text-purple-500 hover:underline">
            Lihat Semua
          </Link>
        </div>
        <div>
          {d.tiketMendatang.map((t, i) => (
            <ListRow
              key={i}
              title={t.judul}
              badge={t.kategori}
              badgeColor="bg-purple-100 text-purple-700"
              meta={`📅 ${t.tanggal} · 📍 ${t.venue}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Role Switcher (demo — hapus kalau sudah ada login beneran) ────────────────
function RoleSwitcher({ role, onChange }) {
  const roles = ["admin", "organizer", "customer"];
  return (
    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
      {roles.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition capitalize ${
            role === r
              ? "bg-white shadow text-purple-700 border border-purple-100"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

// ── Main Dashboard Page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const [role, setRole] = useState("admin");

  useEffect(() => {
    const saved = localStorage.getItem("basdead-role");
    if (saved && ["admin", "organizer", "customer"].includes(saved)) {
      setRole(saved);
    }
  }, []);

  function handleRoleChange(r) {
    setRole(r);
    window.localStorage.setItem("basdead-role", r);
    window.dispatchEvent(new CustomEvent("basdead-role-change", { detail: r }));
  }

  // AIRIN: tambah handleLogout untuk clear session dan redirect ke login
  function handleLogout() {
    window.localStorage.setItem("basdead-role", "guest");
    window.dispatchEvent(new CustomEvent("basdead-role-change", { detail: "guest" }));
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-700">Dashboard</h1>
          <RoleSwitcher role={role} onChange={handleRoleChange} />
        </div>
        {/* AIRIN: pass handleLogout sebagai props onLogout ke tiap dashboard */}
        {role === "admin"     && <AdminDashboard onLogout={handleLogout} />}
        {role === "organizer" && <OrganizerDashboard onLogout={handleLogout} />}
        {role === "customer"  && <CustomerDashboard onLogout={handleLogout} />}
      </div>
    </div>
  );
}