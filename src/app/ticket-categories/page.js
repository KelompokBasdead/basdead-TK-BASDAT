"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";

export default function TicketCategoriesPage() {
  const [role, setRole] = useState("guest");
  const [isModalOpen, setModalOpen] = useState(false);

  // Mock data based on the TK03 spec
  const [categories, setCategories] = useState([
    { id: "tc_001", event: "Konser Melodi Senja", name: "WVIP", price: 1500000, quota: 50 },
    { id: "tc_002", event: "Konser Melodi Senja", name: "VIP", price: 750000, quota: 150 },
    { id: "tc_003", event: "Konser Melodi Senja", name: "Category 1", price: 450000, quota: 300 },
    { id: "tc_004", event: "Konser Melodi Senja", name: "Category 2", price: 250000, quota: 500 },
    { id: "tc_005", event: "Festival Seni Budaya", name: "General Admission", price: 150000, quota: 500 },
    { id: "tc_006", event: "Malam Akustik Bandung", name: "VVIP", price: 2000000, quota: 30 },
    { id: "tc_007", event: "Malam Akustik Bandung", name: "VIP", price: 900000, quota: 100 },
    { id: "tc_008", event: "Malam Akustik Bandung", name: "Regular", price: 350000, quota: 400 },
  ]);

  // Synchronize role from localStorage
  useEffect(() => {
    const currentRole = window.localStorage.getItem("basdead-role") || "guest";
    setRole(currentRole);

    const handleRoleChange = (e) => setRole(e.detail);
    window.addEventListener("basdead-role-change", handleRoleChange);
    return () => window.removeEventListener("basdead-role-change", handleRoleChange);
  }, []);

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const totalKategori = categories.length;
    const totalKuota = categories.reduce((sum, cat) => sum + cat.quota, 0);
    const hargaTertinggi = Math.max(...categories.map(cat => cat.price), 0);
    return { totalKategori, totalKuota, hargaTertinggi };
  }, [categories]);

  const hasModifyAccess = role === "admin" || role === "organizer";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <Navbar mode={role === "guest" ? "public" : "authenticated"} />

      {/* Dark & Soft Purple Header */}
      <div className="bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {hasModifyAccess ? "Manajemen Kategori Tiket" : "Kategori Tiket"}
              </h1>
              <p className="text-purple-200 font-medium">Kelola kategori dan harga tiket per acara</p>
            </div>
            {hasModifyAccess && (
              <button 
                onClick={() => setModalOpen(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-2xl transition-all shadow-sm"
              >
                + Tambah Kategori
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Kategori</p>
            <p className="text-3xl font-bold text-slate-800">{stats.totalKategori}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Kuota</p>
            <p className="text-3xl font-bold text-slate-800">{stats.totalKuota.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Harga Tertinggi</p>
            <p className="text-3xl font-bold text-slate-800">Rp {stats.hargaTertinggi.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Filters / Search Bar (Visual Only) */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Cari kategori..." 
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
          />
          <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-400 transition-all cursor-pointer">
            <option>Semua Acara</option>
            <option>Konser Melodi Senja</option>
            <option>Festival Seni Budaya</option>
            <option>Malam Akustik Bandung</option>
          </select>
        </div>

        {/* Table Section */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs tracking-wider uppercase">
                  <th className="py-4 px-6 font-bold">Kategori</th>
                  <th className="py-4 px-6 font-bold">Acara</th>
                  <th className="py-4 px-6 font-bold">Harga</th>
                  <th className="py-4 px-6 font-bold">Kuota</th>
                  {hasModifyAccess && <th className="py-4 px-6 font-bold text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-800">{cat.name}</td>
                    <td className="py-4 px-6 font-medium text-slate-500">{cat.event}</td>
                    <td className="py-4 px-6 font-semibold text-purple-600">Rp {cat.price.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-6 font-medium text-slate-600">{cat.quota} tiket</td>
                    
                    {hasModifyAccess && (
                      <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-purple-500 mr-4 font-medium transition-colors">Edit</button>
                        <button className="text-slate-400 hover:text-red-500 font-medium transition-colors">Hapus</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal CUD */}
      {isModalOpen && hasModifyAccess && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Tambah Kategori Baru</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ACARA *</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-400 transition-all">
                  <option>Konser Melodi Senja</option>
                  <option>Festival Seni Budaya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">NAMA KATEGORI *</label>
                <input type="text" placeholder="cth. WVIP" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-400 transition-all" />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">HARGA (RP) *</label>
                  <input type="number" placeholder="750000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-400 transition-all" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">KUOTA *</label>
                  <input type="number" placeholder="100" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-400 transition-all" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8 justify-end">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-all">
                Batal
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm">
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}