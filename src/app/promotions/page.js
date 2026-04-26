"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import { promotions as promoSeed } from "../../lib/seedData";

export default function PromotionsPage() {
  const [role, setRole] = useState("admin");
  const [promos, setPromos] = useState(promoSeed);
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState("semua");
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalHapus, setModalHapus] = useState(null);
  const [form, setForm] = useState({ kode: "", tipe: "persentase", nilai: "", mulai: "", berakhir: "", limit: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem("basdead-role");
    if (saved) setRole(saved);
    const listener = (e) => setRole(e.detail);
    window.addEventListener("basdead-role-change", listener);
    return () => window.removeEventListener("basdead-role-change", listener);
  }, []);

  const filteredPromos = useMemo(() => {
    return promos.filter(p => {
      const matchSearch = p.kode.toLowerCase().includes(search.toLowerCase());
      const matchTipe = filterTipe === "semua" || p.tipe === filterTipe;
      return matchSearch && matchTipe;
    });
  }, [promos, search, filterTipe]);

  const stats = useMemo(() => ({
    total: promos.length,
    penggunaan: promos.reduce((a, b) => a + b.terpakai, 0),
    persentase: promos.filter(p => p.tipe === "persentase").length,
  }), [promos]);

  function simpanCreate() {
    const newPromo = {
      promo_id: `promo_00${promos.length + 1}`,
      ...form,
      nilai: Number(form.nilai),
      terpakai: 0,
      limit: Number(form.limit),
    };
    setPromos(prev => [...prev, newPromo]);
    setModalCreate(false);
    setForm({ kode: "", tipe: "persentase", nilai: "", mulai: "", berakhir: "", limit: "" });
  }

  function simpanEdit() {
    setPromos(prev => prev.map(p =>
      p.kode === modalEdit ? { ...p, ...form, nilai: Number(form.nilai), limit: Number(form.limit) } : p
    ));
    setModalEdit(null);
  }

  function konfirmasiHapus() {
    setPromos(prev => prev.filter(p => p.kode !== modalHapus));
    setModalHapus(null);
  }

  function bukaEdit(p) {
    setForm({ kode: p.kode, tipe: p.tipe, nilai: String(p.nilai), mulai: p.mulai, berakhir: p.berakhir, limit: String(p.limit) });
    setModalEdit(p.kode);
  }

  function formatNilai(p) {
    return p.tipe === "nominal" ? "Rp " + p.nilai.toLocaleString("id-ID") : p.nilai + "%";
  }

  function BadgeTipe({ tipe }) {
    return tipe === "persentase"
      ? <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-200">PERSENTASE</span>
      : <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200">NOMINAL</span>;
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-purple-500 transition-colors bg-white";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040] px-8 pt-7 pb-5 text-white flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold">Manajemen Promosi</div>
          <div className="text-sm text-purple-400 mt-1">Kelola kode promo dan kampanye diskon</div>
        </div>
        {role === "admin" && (
          <button onClick={() => setModalCreate(true)}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-purple-500 hover:bg-purple-600 transition-all">
            + Buat Promo
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-8 py-7">

        {/* STAT CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-l-4 border-l-purple-500">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Promo</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-l-4 border-l-purple-400">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Penggunaan</div>
            <div className="text-3xl font-bold">{stats.penggunaan}x</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-l-4 border-l-yellow-500">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tipe Persentase</div>
            <div className="text-3xl font-bold">{stats.persentase}</div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Cari kode promo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-purple-500 transition-colors bg-white"
            />
          </div>
          <select
            value={filterTipe}
            onChange={e => setFilterTipe(e.target.value)}
            className="px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-purple-500 transition-colors bg-white w-44"
          >
            <option value="semua">Semua Tipe</option>
            <option value="persentase">Persentase</option>
            <option value="nominal">Nominal</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040]">
                <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Kode Promo</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Tipe</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Nilai Diskon</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Mulai</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Berakhir</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Penggunaan</th>
                {role === "admin" && <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPromos.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-slate-400 py-10">Tidak ada data</td></tr>
              ) : filteredPromos.map(p => (
                <tr key={p.kode} className="border-b border-slate-100 hover:bg-purple-50 transition-all">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-sm">🏷</div>
                      <span className="font-mono font-semibold text-purple-600">{p.kode}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><BadgeTipe tipe={p.tipe} /></td>
                  <td className="px-5 py-4 font-semibold">{formatNilai(p)}</td>
                  <td className="px-5 py-4 text-slate-500 text-sm">{p.mulai}</td>
                  <td className="px-5 py-4 text-slate-500 text-sm">{p.berakhir}</td>
                  <td className="px-5 py-4 text-sm"><strong>{p.terpakai}</strong> / {p.limit}</td>
                  {role === "admin" && (
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => bukaEdit(p)}
                          className="px-3 py-1.5 border-2 border-purple-500 text-purple-500 rounded-lg text-xs font-semibold hover:bg-purple-500 hover:text-white transition-all">
                          ✏ Edit
                        </button>
                        <button onClick={() => setModalHapus(p.kode)}
                          className="px-3 py-1.5 border-2 border-red-400 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-400 hover:text-white transition-all">
                          🗑 Hapus
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREATE */}
      {modalCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-[480px] shadow-2xl border border-slate-200">
            <div className="text-lg font-bold mb-1">Buat Promo Baru</div>
            <div className="text-sm text-slate-400 mb-6">Tambahkan kode promosi baru ke sistem</div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Kode Promo *</label>
              <input value={form.kode} onChange={e => setForm({...form, kode: e.target.value})} placeholder="CTH. TIKTAK20" className={inputClass} />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tipe Diskon *</label>
              <select value={form.tipe} onChange={e => setForm({...form, tipe: e.target.value})} className={inputClass}>
                <option value="persentase">Persentase (%)</option>
                <option value="nominal">Nominal (Rp)</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nilai Diskon *</label>
              <input type="number" value={form.nilai} onChange={e => setForm({...form, nilai: e.target.value})} placeholder="cth. 20" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tanggal Mulai *</label>
                <input type="date" value={form.mulai} onChange={e => setForm({...form, mulai: e.target.value})} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tanggal Berakhir *</label>
                <input type="date" value={form.berakhir} onChange={e => setForm({...form, berakhir: e.target.value})} className={inputClass} />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Batas Penggunaan *</label>
              <input type="number" value={form.limit} onChange={e => setForm({...form, limit: e.target.value})} placeholder="cth. 100" className={inputClass} />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setModalCreate(false)} className="px-5 py-2 border-2 border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50">Batal</button>
              <button onClick={simpanCreate} className="px-5 py-2 rounded-xl font-semibold text-sm text-white bg-purple-500 hover:bg-purple-600 transition-all">Buat</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {modalEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-[480px] shadow-2xl border border-slate-200">
            <div className="text-lg font-bold mb-1">Edit Promo</div>
            <div className="text-sm text-slate-400 mb-6">Perbarui data kode promosi</div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Kode Promo *</label>
              <input value={form.kode} onChange={e => setForm({...form, kode: e.target.value})} className={inputClass} />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tipe Diskon *</label>
              <select value={form.tipe} onChange={e => setForm({...form, tipe: e.target.value})} className={inputClass}>
                <option value="persentase">Persentase (%)</option>
                <option value="nominal">Nominal (Rp)</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nilai Diskon *</label>
              <input type="number" value={form.nilai} onChange={e => setForm({...form, nilai: e.target.value})} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tanggal Mulai *</label>
                <input type="date" value={form.mulai} onChange={e => setForm({...form, mulai: e.target.value})} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tanggal Berakhir *</label>
                <input type="date" value={form.berakhir} onChange={e => setForm({...form, berakhir: e.target.value})} className={inputClass} />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Batas Penggunaan *</label>
              <input type="number" value={form.limit} onChange={e => setForm({...form, limit: e.target.value})} className={inputClass} />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setModalEdit(null)} className="px-5 py-2 border-2 border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50">Batal</button>
              <button onClick={simpanEdit} className="px-5 py-2 rounded-xl font-semibold text-sm text-white bg-purple-500 hover:bg-purple-600 transition-all">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl border border-slate-200">
            <div className="text-lg font-bold text-red-500 mb-2">Hapus Promo</div>
            <p className="text-sm text-slate-500 mb-6">Apakah Anda yakin ingin menghapus kode promo ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setModalHapus(null)} className="px-5 py-2 border-2 border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50">Batal</button>
              <button onClick={konfirmasiHapus} className="px-5 py-2 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}