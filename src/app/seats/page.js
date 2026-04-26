"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  TikTakTuk — Manajemen Kursi
//  src/app/seats/page.js
//
//  Role behaviour:
//    admin / organizer → Manajemen Kursi — CUD + read
//    customer / guest  → read only (tanpa tombol aksi)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import Navbar from "@/Components/Navbar";
import {
  SEATS, VENUES, HAS_RELATIONSHIP,
  getVenueById, DUMMY_USERS,
} from "@/data/mockData";

export default function SeatsPage() {
  const [role, setRole] = useState("admin");
  const [seats, setSeats] = useState([...SEATS]);
  const [hasRel, setHasRel] = useState([...HAS_RELATIONSHIP]);

  const [search, setSearch] = useState("");
  const [filterVenue, setFilterVenue] = useState("Semua Venue");

  // modals
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const [createForm, setCreateForm] = useState({ venue_id: "", section: "", row_number: "", seat_number: "" });
  const [updateForm, setUpdateForm] = useState({ venue_id: "", section: "", row_number: "", seat_number: "" });
  const [errors, setErrors] = useState({});

  // ── read role ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("basdead-role") || "admin";
    applyRole(saved);
    const handler = (e) => applyRole(e.detail);
    window.addEventListener("basdead-role-change", handler);
    return () => window.removeEventListener("basdead-role-change", handler);
  }, []);

  function applyRole(r) {
    setRole(r);
  }

  function handleRoleSwitch(r) {
    applyRole(r);
    localStorage.setItem("basdead-role", r);
    window.dispatchEvent(new CustomEvent("basdead-role-change", { detail: r }));
  }

  // ── derived ───────────────────────────────────────────────────────────────────
  const occupiedIds = new Set(hasRel.map((r) => r.seat_id));

  const filteredSeats = seats.filter((s) => {
    const venue = getVenueById(s.venue_id);
    const matchSearch =
      s.section.toLowerCase().includes(search.toLowerCase()) ||
      s.row_number.toLowerCase().includes(search.toLowerCase()) ||
      s.seat_number.toLowerCase().includes(search.toLowerCase());
    const matchVenue = filterVenue === "Semua Venue" || venue?.venue_name === filterVenue;
    return matchSearch && matchVenue;
  });

  const totalOccupied = seats.filter((s) => occupiedIds.has(s.seat_id)).length;
  const totalFree = seats.length - totalOccupied;

  // ── create ────────────────────────────────────────────────────────────────────
  function validateCreate() {
    const e = {};
    if (!createForm.venue_id) e.venue_id = "Wajib dipilih";
    if (!createForm.section.trim()) e.section = "Wajib diisi";
    if (!createForm.row_number.trim()) e.row_number = "Wajib diisi";
    if (!createForm.seat_number.trim()) e.seat_number = "Wajib diisi";
    return e;
  }

  function handleCreate() {
    const e = validateCreate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const newSeat = {
      seat_id: `seat_${Date.now()}`,
      ...createForm,
    };
    setSeats((prev) => [...prev, newSeat]);
    setShowCreate(false);
    setCreateForm({ venue_id: "", section: "", row_number: "", seat_number: "" });
    setErrors({});
  }

  // ── update ────────────────────────────────────────────────────────────────────
  function openUpdate(seat) {
    setSelectedSeat(seat);
    setUpdateForm({ venue_id: seat.venue_id, section: seat.section, row_number: seat.row_number, seat_number: seat.seat_number });
    setErrors({});
    setShowUpdate(true);
  }

  function handleUpdate() {
    const e = {};
    if (!updateForm.section.trim()) e.section = "Wajib diisi";
    if (!updateForm.row_number.trim()) e.row_number = "Wajib diisi";
    if (!updateForm.seat_number.trim()) e.seat_number = "Wajib diisi";
    if (Object.keys(e).length) { setErrors(e); return; }
    setSeats((prev) => prev.map((s) => s.seat_id === selectedSeat.seat_id ? { ...s, ...updateForm } : s));
    setShowUpdate(false);
    setErrors({});
  }

  // ── delete ────────────────────────────────────────────────────────────────────
  function openDelete(seat) {
    setSelectedSeat(seat);
    if (occupiedIds.has(seat.seat_id)) {
      setShowDeleteError(true);
    } else {
      setShowDelete(true);
    }
  }

  function handleDelete() {
    setSeats((prev) => prev.filter((s) => s.seat_id !== selectedSeat.seat_id));
    setShowDelete(false);
  }

  const isAdminOrOrganizer = role === "admin" || role === "organizer";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Kursi</h1>
            <p className="text-sm text-slate-400 mt-1">Kelola kursi dan denah tempat duduk venue</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Role switcher */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {["customer", "organizer", "admin"].map((r) => (
                <button key={r} onClick={() => handleRoleSwitch(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize ${role === r ? "bg-white shadow text-purple-700 border border-purple-100" : "text-slate-500 hover:text-slate-700"}`}>
                  {r}
                </button>
              ))}
            </div>
            {isAdminOrOrganizer && (
              <button onClick={() => { setShowCreate(true); setErrors({}); setCreateForm({ venue_id: "", section: "", row_number: "", seat_number: "" }); }}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm">
                + Tambah Kursi
              </button>
            )}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "TOTAL KURSI", value: seats.length },
            { label: "TERSEDIA", value: totalFree },
            { label: "TERISI", value: totalOccupied },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-purple-200 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-slate-400 tracking-wider">{s.label}</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-2 flex-1 min-w-[200px] shadow-sm">
            <span className="text-slate-300 text-sm">🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari section, baris, atau nomor..."
              className="flex-1 text-sm text-slate-700 placeholder:text-slate-300 outline-none bg-transparent" />
          </div>
          <select value={filterVenue} onChange={(e) => setFilterVenue(e.target.value)}
            className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-purple-300">
            <option>Semua Venue</option>
            {VENUES.filter((v) => v.has_reserved_seating).map((v) => (
              <option key={v.venue_id}>{v.venue_name}</option>
            ))}
          </select>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 tracking-wider">SECTION</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 tracking-wider">BARIS</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 tracking-wider">NO. KURSI</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 tracking-wider">VENUE</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 tracking-wider">STATUS</th>
                {isAdminOrOrganizer && <th className="px-4 py-3.5" />}
              </tr>
            </thead>
            <tbody>
              {filteredSeats.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-slate-300">Tidak ada kursi ditemukan</td></tr>
              )}
              {filteredSeats.map((seat, idx) => {
                const venue = getVenueById(seat.venue_id);
                const occupied = occupiedIds.has(seat.seat_id);
                return (
                  <tr key={seat.seat_id}
                    className={`border-b border-slate-50 hover:bg-slate-50 transition ${idx % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 text-sm">🪑</div>
                        <span className="font-semibold text-slate-700">{seat.section}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">{seat.row_number}</td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">{seat.seat_number}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="text-xs">🏟</span>
                        <span className="text-xs font-medium">{venue?.venue_name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {occupied ? (
                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">⊗ TERISI</span>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">⊙ TERSEDIA</span>
                      )}
                    </td>
                    {isAdminOrOrganizer && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openUpdate(seat)}
                            className="text-slate-400 hover:text-blue-600 transition text-base" title="Edit">✏️</button>
                          <button
                            onClick={() => openDelete(seat)}
                            disabled={occupied}
                            className={`text-base transition ${occupied ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-red-500"}`}
                            title={occupied ? "Kursi terisi, tidak bisa dihapus" : "Hapus"}>
                            🗑
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ Modal: Create Seat ══════════════════════════════════════════════════ */}
      {showCreate && (
        <ModalOverlay onClose={() => setShowCreate(false)}>
          <ModalCard title="Tambah Kursi Baru" onClose={() => setShowCreate(false)}>
            <div className="space-y-4">
              <FormField label="VENUE" error={errors.venue_id}>
                <select value={createForm.venue_id}
                  onChange={(e) => setCreateForm({ ...createForm, venue_id: e.target.value })}
                  className={selectCls(errors.venue_id)}>
                  <option value="">-- Pilih Venue --</option>
                  {VENUES.map((v) => <option key={v.venue_id} value={v.venue_id}>{v.venue_name}</option>)}
                </select>
              </FormField>
              <FormField label="SECTION" error={errors.section}>
                <input value={createForm.section}
                  onChange={(e) => setCreateForm({ ...createForm, section: e.target.value })}
                  placeholder="cth. WVIP" className={inputCls(errors.section)} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="BARIS" error={errors.row_number}>
                  <input value={createForm.row_number}
                    onChange={(e) => setCreateForm({ ...createForm, row_number: e.target.value })}
                    placeholder="cth. A" className={inputCls(errors.row_number)} />
                </FormField>
                <FormField label="NO. KURSI" error={errors.seat_number}>
                  <input value={createForm.seat_number}
                    onChange={(e) => setCreateForm({ ...createForm, seat_number: e.target.value })}
                    placeholder="cth. 1" className={inputCls(errors.seat_number)} />
                </FormField>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className={btnSecondary}>Batal</button>
              <button onClick={handleCreate} className={btnPrimary}>Tambah</button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* ══ Modal: Update Seat ══════════════════════════════════════════════════ */}
      {showUpdate && selectedSeat && (
        <ModalOverlay onClose={() => setShowUpdate(false)}>
          <ModalCard title="Edit Kursi" onClose={() => setShowUpdate(false)}>
            <div className="space-y-4">
              <FormField label="VENUE">
                <select value={updateForm.venue_id}
                  onChange={(e) => setUpdateForm({ ...updateForm, venue_id: e.target.value })}
                  className={selectCls()}>
                  {VENUES.map((v) => <option key={v.venue_id} value={v.venue_id}>{v.venue_name}</option>)}
                </select>
              </FormField>
              <FormField label="SECTION" error={errors.section}>
                <input value={updateForm.section}
                  onChange={(e) => setUpdateForm({ ...updateForm, section: e.target.value })}
                  className={inputCls(errors.section)} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="BARIS" error={errors.row_number}>
                  <input value={updateForm.row_number}
                    onChange={(e) => setUpdateForm({ ...updateForm, row_number: e.target.value })}
                    className={inputCls(errors.row_number)} />
                </FormField>
                <FormField label="NO. KURSI" error={errors.seat_number}>
                  <input value={updateForm.seat_number}
                    onChange={(e) => setUpdateForm({ ...updateForm, seat_number: e.target.value })}
                    className={inputCls(errors.seat_number)} />
                </FormField>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUpdate(false)} className={btnSecondary}>Batal</button>
              <button onClick={handleUpdate} className={btnPrimary}>Simpan</button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* ══ Modal: Delete Confirm ═══════════════════════════════════════════════ */}
      {showDelete && selectedSeat && (
        <ModalOverlay onClose={() => setShowDelete(false)}>
          <ModalCard title="Hapus Kursi" onClose={() => setShowDelete(false)} danger>
            <p className="text-sm text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus kursi ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <p className="mt-2 text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg">
              {selectedSeat.section} — Baris {selectedSeat.row_number}, No. {selectedSeat.seat_number}
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDelete(false)} className={btnSecondary}>Batal</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl transition">Hapus</button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* ══ Modal: Delete Error (seat assigned) ════════════════════════════════ */}
      {showDeleteError && selectedSeat && (
        <ModalOverlay onClose={() => setShowDeleteError(false)}>
          <ModalCard title="Tidak Dapat Dihapus" onClose={() => setShowDeleteError(false)} danger>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 leading-relaxed">
              ⚠️ Kursi ini sudah di-assign ke tiket dan tidak dapat dihapus. Hapus atau ubah tiket terlebih dahulu.
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowDeleteError(false)} className={`${btnSecondary} w-full`}>Mengerti</button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}
    </div>
  );
}

// ─── Shared sub-components & utils ────────────────────────────────────────────
const selectCls = (err) =>
  `w-full border ${err ? "border-red-300" : "border-slate-200"} rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300`;

const inputCls = (err) =>
  `w-full border ${err ? "border-red-300" : "border-slate-200"} rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-300`;

const btnPrimary = "flex-1 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold py-2.5 rounded-xl transition";
const btnSecondary = "flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition";

function FormField({ label, children, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-400 tracking-wider">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ModalOverlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      {children}
    </div>
  );
}

function ModalCard({ title, children, onClose, danger }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-base font-bold ${danger ? "text-red-600" : "text-slate-800"}`}>{title}</h2>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition text-lg">✕</button>
      </div>
      {children}
    </div>
  );
}