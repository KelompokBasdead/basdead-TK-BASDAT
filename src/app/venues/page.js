"use client";

import Navbar from "../../Components/Navbar";
import { venues as venueSeed } from "../../lib/seedData";
import { useEffect, useMemo, useState } from "react";

const emptyVenue = {
  venue_id: "",
  venue_name: "",
  capacity: "",
  address: "",
  city: "",
  has_reserved_seating: false,
};

function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function makeId() {
  return crypto.randomUUID();
}

export default function VenuesPage() {
  const [venues, setVenues] = useState(venueSeed);
  const [form, setForm] = useState(emptyVenue);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [seating, setSeating] = useState("");
  const [role, setRole] = useState("admin");

  useEffect(() => {
    const savedRole = window.localStorage.getItem("basdead-role");
    if (savedRole) setRole(savedRole);
    const savedVenues = window.localStorage.getItem("basdead-venues");
    if (savedVenues) setVenues(JSON.parse(savedVenues));

    const listener = (event) => setRole(event.detail);
    window.addEventListener("basdead-role-change", listener);
    return () => window.removeEventListener("basdead-role-change", listener);
  }, []);

  function persist(nextVenues) {
    setVenues(nextVenues);
    window.localStorage.setItem("basdead-venues", JSON.stringify(nextVenues));
  }

  const canManage = role === "admin" || role === "organizer";
  const cities = [...new Set(venues.map((venue) => venue.city))].sort();
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const searchable = `${venue.venue_name} ${venue.address}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesCity = city ? venue.city === city : true;
      const matchesSeating = seating ? String(venue.has_reserved_seating) === seating : true;
      return matchesQuery && matchesCity && matchesSeating;
    });
  }, [venues, query, city, seating]);

  const stats = {
    total: venues.length,
    reserved: venues.filter((venue) => venue.has_reserved_seating).length,
    capacity: venues.reduce((sum, venue) => sum + Number(venue.capacity), 0),
  };

  function openCreateForm() {
    setForm(emptyVenue);
    setIsFormOpen(true);
  }

  function openEditForm(venue) {
    setForm({ ...venue, capacity: String(venue.capacity) });
    setIsFormOpen(true);
  }

  function submitVenue(event) {
    event.preventDefault();
    const payload = {
      ...form,
      venue_id: form.venue_id || makeId(),
      capacity: Number(form.capacity),
    };

    const nextVenues = form.venue_id
      ? venues.map((venue) => (venue.venue_id === form.venue_id ? payload : venue))
      : [payload, ...venues];

    persist(nextVenues);
    setIsFormOpen(false);
    setForm(emptyVenue);
  }

  function confirmDelete() {
    persist(venues.filter((venue) => venue.venue_id !== deleteTarget.venue_id));
    setDeleteTarget(null);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Manajemen Venue</p>
            <h1 className="text-3xl font-black text-slate-950">Venue</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Data venue mengikuti tabel VENUE: nama, alamat, kota, kapasitas, dan jenis seating.
            </p>
          </div>
          {canManage && (
            <button
              onClick={openCreateForm}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
            >
              + Tambah Venue
            </button>
          )}
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Total Venue" value={stats.total} />
          <StatCard label="Reserved Seating" value={stats.reserved} />
          <StatCard label="Total Kapasitas" value={formatNumber(stats.capacity)} />
        </div>

        <div className="mb-5 grid gap-3 rounded border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
            placeholder="Cari nama atau alamat venue"
          />
          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
          >
            <option value="">Semua Kota</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={seating}
            onChange={(event) => setSeating(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
          >
            <option value="">Semua Tipe Seating</option>
            <option value="true">Reserved Seating</option>
            <option value="false">Free Seating</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredVenues.map((venue) => (
            <article key={venue.venue_id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-purple-200 hover:shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-purple-400 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between ml-1">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">{venue.venue_name}</h2>
                    <span className="rounded-md bg-purple-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-purple-600 ring-1 ring-inset ring-purple-200/50">
                      {venue.has_reserved_seating ? "Reserved Seating" : "Free Seating"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <span className="text-purple-400">📍</span>
                      {venue.city}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="text-purple-400">🗺️</span>
                      {venue.address}
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-100">
                    <span className="text-purple-400">👥</span>
                    <span>Kapasitas: <strong className="font-semibold text-slate-800">{formatNumber(venue.capacity)}</strong></span>
                  </div>
                </div>

                {canManage && (
                  <div className="flex shrink-0 gap-2 mt-2 md:mt-0">
                    <button
                      onClick={() => openEditForm(venue)}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(venue)}
                      className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {isFormOpen && (
        <VenueModal
          form={form}
          setForm={setForm}
          onClose={() => setIsFormOpen(false)}
          onSubmit={submitVenue}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          venue={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function VenueModal({ form, setForm, onClose, onSubmit }) {
  const isEdit = Boolean(form.venue_id);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-xl rounded bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">{isEdit ? "Edit Venue" : "Tambah Venue Baru"}</h2>
            <p className="text-sm text-slate-500">Isi field sesuai atribut VENUE pada database.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100">
            X
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nama Venue">
            <input
              required
              value={form.venue_name}
              onChange={(event) => setForm({ ...form, venue_name: event.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
              placeholder="cth : jakarta convention center"
            />
          </Field>
          <Field label="Kapasitas">
            <input
              required
              min="1"
              type="number"
              value={form.capacity}
              onChange={(event) => setForm({ ...form, capacity: event.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
              placeholder="1000"
            />
          </Field>
          <Field label="Kota">
            <input
              required
              value={form.city}
              onChange={(event) => setForm({ ...form, city: event.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
              placeholder="Jakarta"
            />
          </Field>
          <Field label="Jenis Seating">
            <label className="flex h-10 items-center gap-2 rounded border border-slate-300 px-3 text-sm">
              <input
                type="checkbox"
                checked={form.has_reserved_seating}
                onChange={(event) => setForm({ ...form, has_reserved_seating: event.target.checked })}
              />
              Has Reserved Seating
            </label>
          </Field>
          <Field label="Alamat" className="md:col-span-2">
            <textarea
              required
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              className="min-h-24 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
              placeholder="Jl. Gatot Subroto"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border border-slate-300 px-4 py-2 text-sm font-bold">
            Batal
          </button>
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
            {isEdit ? "Simpan" : "Tambah"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function ConfirmDelete({ venue, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-xl">
        <h2 className="text-xl font-black text-red-700">Hapus Venue</h2>
        <p className="mt-2 text-sm text-slate-600">
          Apakah Anda yakin ingin menghapus venue ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        <p className="mt-4 rounded bg-red-50 p-3 text-sm font-bold text-red-800">{venue.venue_name}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded border border-slate-300 px-4 py-2 text-sm font-bold">
            Batal
          </button>
          <button onClick={onConfirm} className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

