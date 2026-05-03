"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  TikTakTuk — Manajemen Tiket / Tiket Saya
//  src/app/my-tickets/page.js
//
//  Role behaviour:
//    customer  → "Tiket Saya"   — hanya tiket milik cust_001 (Budi Santoso)
//    organizer → "Manajemen Tiket" — semua tiket (+ Tambah Tiket, TANPA Update/Delete)
//    admin     → "Manajemen Tiket" — semua tiket (+ Tambah Tiket + Update + Delete)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import Navbar from "@/Components/Navbar";
import {
  TICKETS, ORDERS, TICKET_CATEGORIES, SEATS, EVENTS, VENUES, CUSTOMERS, HAS_RELATIONSHIP,
  getVenueById, getEventById, getCategoryById, getOrderById, getCustomerById, getSeatById,
  formatRupiah, formatDateTime, isSeatOccupied, getEventForOrder, DUMMY_USERS,
} from "@/data/mockData";

// ─── helpers ───────────────────────────────────────────────────────────────────
function genTicketCode(categoryName, eventTitle) {
  const evtSlug = eventTitle.replace(/\s+/g, "").substring(0, 5).toUpperCase();
  const catSlug = categoryName.replace(/\s+/g, "").substring(0, 3).toUpperCase();
  const rand = Math.floor(Math.random() * 900 + 100);
  return `TTK-${evtSlug}-${catSlug}-${rand}`;
}

const STATUS_COLORS = {
  Valid: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Used: "bg-slate-100 text-slate-500 border border-slate-200",
  Cancelled: "bg-red-100 text-red-600 border border-red-200",
};

const CAT_COLORS = ["bg-purple-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-fuchsia-500"];

// ─── main component ────────────────────────────────────────────────────────────
export default function MyTicketsPage() {
  const [role, setRole] = useState("customer");
  const [tickets, setTickets] = useState([]);
  const [hasRel, setHasRel] = useState([...HAS_RELATIONSHIP]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // modals
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // create form state
  const [createForm, setCreateForm] = useState({ order_id: "", category_id: "", seat_id: "" });
  const [createEvent, setCreateEvent] = useState(null);

  // update form state
  const [updateForm, setUpdateForm] = useState({ status: "Valid", seat_id: "" });

  // ── read role & init ──────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("basdead-role") || "customer";
    applyRole(saved);
    const handler = (e) => applyRole(e.detail);
    window.addEventListener("basdead-role-change", handler);
    return () => window.removeEventListener("basdead-role-change", handler);
  }, []);

  function applyRole(r) {
    setRole(r);
    const currentUser = DUMMY_USERS[r] || DUMMY_USERS.customer;
    if (r === "customer") {
      // only tickets belonging to cust_001 (Budi Santoso) via order chain
      const myOrderIds = ORDERS.filter((o) => o.customer_id === currentUser.customer_id).map((o) => o.order_id);
      setTickets(TICKETS.filter((t) => myOrderIds.includes(t.torder_id)));
    } else {
      setTickets([...TICKETS]);
    }
    setShowCreate(false);
    setShowUpdate(false);
    setShowDelete(false);
  }

  function handleRoleSwitch(r) {
    applyRole(r);
    localStorage.setItem("basdead-role", r);
    window.dispatchEvent(new CustomEvent("basdead-role-change", { detail: r }));
  }

  // ── derived data ──────────────────────────────────────────────────────────────
  const filteredTickets = tickets.filter((t) => {
    const cat = getCategoryById(t.tcategory_id);
    const evt = cat ? getEventById(cat.tevent_id) : null;
    const matchSearch = t.ticket_code.toLowerCase().includes(search.toLowerCase()) ||
      (evt?.event_title || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Semua" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalValid = tickets.filter((t) => t.status === "Valid").length;
  const totalUsed = tickets.filter((t) => t.status === "Used").length;

  // ── create ticket ─────────────────────────────────────────────────────────────
  function onOrderChange(orderId) {
    setCreateForm({ order_id: orderId, category_id: "", seat_id: "" });
    const evt = getEventForOrder(orderId);
    setCreateEvent(evt);
  }

  function handleCreate() {
    if (!createForm.order_id || !createForm.category_id) return;
    const cat = getCategoryById(createForm.category_id);
    const evt = createEvent;
    const newCode = genTicketCode(cat?.category_name || "TKT", evt?.event_title || "EVT");
    const newTicket = {
      ticket_id: `tkt_${Date.now()}`,
      ticket_code: newCode,
      tcategory_id: createForm.category_id,
      torder_id: createForm.order_id,
      status: "Valid",
      seat_id: createForm.seat_id || null,
    };
    
    // Mutate global dummy data so it persists across page navigations
    TICKETS.unshift(newTicket);
    
    if (createForm.seat_id) {
      const newRel = { seat_id: createForm.seat_id, ticket_id: newTicket.ticket_id };
      HAS_RELATIONSHIP.push(newRel);
      setHasRel((prev) => [...prev, newRel]);
    }
    setTickets((prev) => [newTicket, ...prev]);
    setShowCreate(false);
    setCreateForm({ order_id: "", category_id: "", seat_id: "" });
    setCreateEvent(null);
  }

  // ── update ticket ─────────────────────────────────────────────────────────────
  function openUpdate(ticket) {
    setSelectedTicket(ticket);
    setUpdateForm({ status: ticket.status, seat_id: ticket.seat_id || "" });
    setShowUpdate(true);
  }

  function handleUpdate() {
    // Mutate global dummy data
    const tIdx = TICKETS.findIndex(t => t.ticket_id === selectedTicket.ticket_id);
    if (tIdx !== -1) {
      TICKETS[tIdx] = { ...TICKETS[tIdx], status: updateForm.status, seat_id: updateForm.seat_id || null };
    }

    setTickets((prev) =>
      prev.map((t) =>
        t.ticket_id === selectedTicket.ticket_id
          ? { ...t, status: updateForm.status, seat_id: updateForm.seat_id || null }
          : t
      )
    );
    // update has_relationship if seat changed
    setHasRel((prev) => {
      const filtered = prev.filter((r) => r.ticket_id !== selectedTicket.ticket_id);
      
      // Remove from global array
      const relIdx = HAS_RELATIONSHIP.findIndex((r) => r.ticket_id === selectedTicket.ticket_id);
      if (relIdx !== -1) HAS_RELATIONSHIP.splice(relIdx, 1);
      
      if (updateForm.seat_id) {
        const newRel = { seat_id: updateForm.seat_id, ticket_id: selectedTicket.ticket_id };
        HAS_RELATIONSHIP.push(newRel); // Add to global
        return [...filtered, newRel];
      }
      return filtered;
    });
    setShowUpdate(false);
  }

  // ── delete ticket ─────────────────────────────────────────────────────────────
  function openDelete(ticket) {
    setSelectedTicket(ticket);
    setShowDelete(true);
  }

  function handleDelete() {
    // Mutate global dummy data
    const tIdx = TICKETS.findIndex(t => t.ticket_id === selectedTicket.ticket_id);
    if (tIdx !== -1) TICKETS.splice(tIdx, 1);
    
    const rIdx = HAS_RELATIONSHIP.findIndex((r) => r.ticket_id === selectedTicket.ticket_id);
    if (rIdx !== -1) HAS_RELATIONSHIP.splice(rIdx, 1);

    setHasRel((prev) => prev.filter((r) => r.ticket_id !== selectedTicket.ticket_id));
    setTickets((prev) => prev.filter((t) => t.ticket_id !== selectedTicket.ticket_id));
    setShowDelete(false);
  }

  // ── available seats for create (reserved seating only, unassigned) ─────────────
  function getAvailableSeats(eventId) {
    const evt = getEventById(eventId);
    if (!evt) return [];
    const venue = getVenueById(evt.venue_id);
    if (!venue?.has_reserved_seating) return [];
    const occupiedIds = hasRel.map((r) => r.seat_id);
    return SEATS.filter((s) => s.venue_id === evt.venue_id && !occupiedIds.includes(s.seat_id));
  }

  const isReservedVenueForCreate = createEvent
    ? getVenueById(createEvent.venue_id)?.has_reserved_seating
    : false;
  const availableSeatsCreate = createEvent ? getAvailableSeats(createEvent.event_id) : [];

  // for update: available seats = unassigned + current seat of this ticket
  const updateTicketEvent = selectedTicket
    ? getEventById(getCategoryById(selectedTicket.tcategory_id)?.tevent_id)
    : null;
  const isReservedVenueForUpdate = updateTicketEvent
    ? getVenueById(updateTicketEvent.venue_id)?.has_reserved_seating
    : false;
  const availableSeatsUpdate = updateTicketEvent
    ? (() => {
        const occupiedIds = hasRel.filter((r) => r.ticket_id !== selectedTicket?.ticket_id).map((r) => r.seat_id);
        return SEATS.filter((s) => s.venue_id === updateTicketEvent.venue_id && !occupiedIds.includes(s.seat_id));
      })()
    : [];

  // categories for create (filtered by event)
  const availableCategories = createEvent
    ? TICKET_CATEGORIES.filter((c) => c.tevent_id === createEvent.event_id)
    : [];

  // ── render ────────────────────────────────────────────────────────────────────
  const isAdmin = role === "admin";
  const isAdminOrOrganizer = role === "admin" || role === "organizer";
  const pageTitle = role === "customer" ? "Tiket Saya" : "Manajemen Tiket";
  const pageSubtitle = role === "customer"
    ? "Kelola dan akses tiket pertunjukan Anda"
    : "Kelola tiket: tambah, ubah status, dan hapus tiket";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">

        {/* ── Role Switcher ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{pageTitle}</h1>
            <p className="text-sm text-slate-400 mt-1">{pageSubtitle}</p>
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
            {/* Add ticket button */}
            {isAdminOrOrganizer && (
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm">
                + Tambah Tiket
              </button>
            )}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "TOTAL TIKET", value: tickets.length },
            { label: "VALID", value: totalValid },
            { label: "TERPAKAI", value: totalUsed },
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
              placeholder="Cari kode tiket atau nama acara..."
              className="flex-1 text-sm text-slate-700 placeholder:text-slate-300 outline-none bg-transparent" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-purple-300">
            {["Semua", "Valid", "Used", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* ── Ticket Cards ── */}
        <div className="space-y-4">
          {filteredTickets.length === 0 && (
            <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
              <p className="text-4xl mb-3">🎫</p>
              <p className="font-semibold">Tidak ada tiket ditemukan</p>
            </div>
          )}
          {filteredTickets.map((ticket, idx) => {
            const cat = getCategoryById(ticket.tcategory_id);
            const evt = cat ? getEventById(cat.tevent_id) : null;
            const venue = evt ? getVenueById(evt.venue_id) : null;
            const order = getOrderById(ticket.torder_id);
            const customer = order ? getCustomerById(order.customer_id) : null;
            const seat = ticket.seat_id ? getSeatById(ticket.seat_id) : null;
            const bgColor = CAT_COLORS[idx % CAT_COLORS.length];
            return (
              <div key={ticket.ticket_id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-purple-200 hover:shadow-md transition-all overflow-hidden">
                <div className="flex gap-4 p-5">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center text-white text-lg shrink-0`}>🎟</div>

                  <div className="flex-1 min-w-0">
                    {/* Status + Category badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[ticket.status] || "bg-slate-100 text-slate-500"}`}>
                        {ticket.status.toUpperCase()}
                      </span>
                      {cat && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{cat.category_name}</span>}
                    </div>

                    {/* Event title + ticket code */}
                    <p className="font-bold text-slate-800 text-base">{evt?.event_title || "—"}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{ticket.ticket_code}</p>

                    {/* Details grid */}
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs text-slate-500">
                      {evt && (
                        <div>
                          <p className="text-slate-300 font-semibold uppercase tracking-wider">Jadwal</p>
                          <p className="text-slate-600 font-medium">📅 {formatDateTime(evt.event_datetime)}</p>
                        </div>
                      )}
                      {venue && (
                        <div>
                          <p className="text-slate-300 font-semibold uppercase tracking-wider">Lokasi</p>
                          <p className="text-slate-600 font-medium">📍 {venue.venue_name}</p>
                        </div>
                      )}
                      {seat && (
                        <div>
                          <p className="text-slate-300 font-semibold uppercase tracking-wider">Kursi</p>
                          <p className="text-slate-600 font-medium">{seat.section} {seat.row_number}-{seat.seat_number}</p>
                        </div>
                      )}
                      {cat && (
                        <div>
                          <p className="text-slate-300 font-semibold uppercase tracking-wider">Harga</p>
                          <p className="text-slate-600 font-medium">{formatRupiah(cat.price)}</p>
                        </div>
                      )}
                      {order && (
                        <div>
                          <p className="text-slate-300 font-semibold uppercase tracking-wider">Order</p>
                          <p className="text-slate-600 font-medium">{order.order_id}</p>
                        </div>
                      )}
                      {customer && (isAdmin || role === "organizer") && (
                        <div>
                          <p className="text-slate-300 font-semibold uppercase tracking-wider">Pelanggan</p>
                          <p className="text-slate-600 font-medium">{customer.full_name}</p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons — customer sees QR/share, admin sees Update/Delete */}
                    <div className="mt-4 flex items-center gap-3">
                      {role === "customer" && (
                        <>
                          <button className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">
                            🔲 Tampilkan QR
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition text-sm">⬇</button>
                          <button className="text-slate-400 hover:text-slate-600 transition text-sm">↗</button>
                        </>
                      )}
                      {isAdmin && (
                        <>
                          <button onClick={() => openUpdate(ticket)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
                            ✏️ Update
                          </button>
                          <button onClick={() => openDelete(ticket)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                            🗑 Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* QR placeholder */}
                  <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
                    <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-lg grid grid-cols-3 gap-0.5 p-1.5">
                      {Array(9).fill(0).map((_, i) => (
                        <div key={i} className={`rounded-[2px] ${i % 3 === 0 ? "bg-slate-800" : i % 2 === 0 ? "bg-slate-400" : "bg-slate-200"}`} />
                      ))}
                    </div>
                    <p className="text-[9px] text-slate-300 mt-1 font-semibold tracking-widest">SCAN ENTRY</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ Modal: Create Ticket ════════════════════════════════════════════════ */}
      {showCreate && (
        <ModalOverlay onClose={() => setShowCreate(false)}>
          <ModalCard title="Tambah Tiket Baru" onClose={() => setShowCreate(false)}>
            <div className="space-y-4">
              {/* Order */}
              <FormField label="ORDER">
                <select value={createForm.order_id} onChange={(e) => onOrderChange(e.target.value)}
                  className={selectCls}>
                  <option value="">-- Pilih Order --</option>
                  {ORDERS.map((o) => {
                    const c = getCustomerById(o.customer_id);
                    const evt = getEventForOrder(o.order_id);
                    return (
                      <option key={o.order_id} value={o.order_id}>
                        {o.order_id} — {c?.full_name || "?"} — {evt?.event_title || "?"}
                      </option>
                    );
                  })}
                </select>
              </FormField>

              {/* Kategori */}
              <FormField label="KATEGORI TIKET">
                <select value={createForm.category_id}
                  onChange={(e) => setCreateForm({ ...createForm, category_id: e.target.value, seat_id: "" })}
                  disabled={!createEvent} className={selectCls}>
                  <option value="">-- Pilih Kategori --</option>
                  {availableCategories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_name} — {formatRupiah(c.price)} ({
                        TICKETS.filter((t) => t.tcategory_id === c.category_id && t.status !== "Cancelled").length
                      }/{c.quota})
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Kursi (optional) */}
              {isReservedVenueForCreate && createForm.category_id && (
                <FormField label="KURSI (opsional — reserved seating)">
                  <select value={createForm.seat_id}
                    onChange={(e) => setCreateForm({ ...createForm, seat_id: e.target.value })}
                    className={selectCls}>
                    <option value="">-- Tanpa Kursi --</option>
                    {availableSeatsCreate.map((s) => (
                      <option key={s.seat_id} value={s.seat_id}>
                        {s.section} — Baris {s.row_number}, No. {s.seat_number}
                      </option>
                    ))}
                  </select>
                </FormField>
              )}

              {/* Kode tiket */}
              <FormField label="KODE TIKET">
                <input readOnly value="Auto-generate saat dibuat"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-400 bg-slate-50 font-mono" />
              </FormField>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)}
                className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">
                Batal
              </button>
              <button onClick={handleCreate}
                disabled={!createForm.order_id || !createForm.category_id}
                className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:opacity-40 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                Buat Tiket
              </button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* ══ Modal: Update Ticket ═══════════════════════════════════════════════ */}
      {showUpdate && selectedTicket && (
        <ModalOverlay onClose={() => setShowUpdate(false)}>
          <ModalCard title="Update Tiket" onClose={() => setShowUpdate(false)}>
            <div className="space-y-4">
              <FormField label="KODE TIKET">
                <input readOnly value={selectedTicket.ticket_code}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-700 bg-slate-50" />
              </FormField>

              <FormField label="STATUS">
                <select value={updateForm.status}
                  onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                  className={selectCls}>
                  {["Valid", "Used", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </FormField>

              {isReservedVenueForUpdate && (
                <FormField label="KURSI (opsional)">
                  <select value={updateForm.seat_id}
                    onChange={(e) => setUpdateForm({ ...updateForm, seat_id: e.target.value })}
                    className={selectCls}>
                    <option value="">-- Tanpa Kursi --</option>
                    {availableSeatsUpdate.map((s) => (
                      <option key={s.seat_id} value={s.seat_id}>
                        {s.section} — Baris {s.row_number}, No. {s.seat_number}
                      </option>
                    ))}
                    {selectedTicket.seat_id && (() => {
                      const cur = getSeatById(selectedTicket.seat_id);
                      return cur ? <option value={cur.seat_id}>{cur.section} — Baris {cur.row_number}, No. {cur.seat_number} (saat ini)</option> : null;
                    })()}
                  </select>
                </FormField>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUpdate(false)}
                className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">
                Batal
              </button>
              <button onClick={handleUpdate}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                ✓ Simpan
              </button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* ══ Modal: Delete Ticket ═══════════════════════════════════════════════ */}
      {showDelete && selectedTicket && (
        <ModalOverlay onClose={() => setShowDelete(false)}>
          <ModalCard title="Hapus Tiket" onClose={() => setShowDelete(false)} danger>
            <p className="text-sm text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus tiket ini? Relasi kursi akan dilepaskan. Tindakan ini tidak dapat dibatalkan.
            </p>
            <p className="mt-3 font-mono text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg">{selectedTicket.ticket_code}</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDelete(false)}
                className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">
                Batal
              </button>
              <button onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                Hapus
              </button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}
    </div>
  );
}

// ─── Shared sub-components ─────────────────────────────────────────────────────
const selectCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300";

function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-400 tracking-wider">{label}</label>
      {children}
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
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-base font-bold ${danger ? "text-red-600" : "text-slate-800"}`}>{title}</h2>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition text-lg leading-none">✕</button>
      </div>
      {children}
    </div>
  );
}