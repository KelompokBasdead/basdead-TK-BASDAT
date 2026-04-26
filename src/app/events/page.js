"use client";

import Navbar from "../../Components/Navbar";
import { artists, events as eventSeed, organizers, venues } from "../../lib/seedData";
import { useEffect, useMemo, useState } from "react";

const emptyEvent = {
  event_id: "",
  event_title: "",
  date: "",
  time: "",
  venue_id: "",
  organizer_id: organizers[0].organizer_id,
  artist_ids: [],
  description: "",
  ticket_categories: [{ category_name: "", quota: "", price: "" }],
};

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function splitDateTime(value) {
  const [date, time = ""] = value.split("T");
  return { date, time: time.slice(0, 5) };
}

function makeDateTime(date, time) {
  return `${date}T${time}`;
}

export default function EventsPage() {
  const [events, setEvents] = useState(eventSeed);
  const [form, setForm] = useState(emptyEvent);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [artistFilter, setArtistFilter] = useState("");
  const [role, setRole] = useState("admin");

  useEffect(() => {
    const savedRole = window.localStorage.getItem("basdead-role");
    if (savedRole) setRole(savedRole);
    const savedEvents = window.localStorage.getItem("basdead-events");
    if (savedEvents) setEvents(JSON.parse(savedEvents));

    const listener = (event) => setRole(event.detail);
    window.addEventListener("basdead-role-change", listener);
    return () => window.removeEventListener("basdead-role-change", listener);
  }, []);

  function persist(nextEvents) {
    setEvents(nextEvents);
    window.localStorage.setItem("basdead-events", JSON.stringify(nextEvents));
  }

  const canManage = role === "admin" || role === "organizer";
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const artistNames = event.artist_ids.map((id) => artists.find((artist) => artist.artist_id === id)?.name ?? "");
      const searchable = `${event.event_title} ${artistNames.join(" ")}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesVenue = venueFilter ? event.venue_id === venueFilter : true;
      const matchesArtist = artistFilter ? event.artist_ids.includes(artistFilter) : true;
      return matchesQuery && matchesVenue && matchesArtist;
    });
  }, [events, query, venueFilter, artistFilter]);

  function openCreateForm() {
    setForm({ ...emptyEvent, venue_id: venues[0].venue_id });
    setIsFormOpen(true);
  }

  function openEditForm(event) {
    const { date, time } = splitDateTime(event.event_datetime);
    setForm({
      ...event,
      date,
      time,
      ticket_categories: event.ticket_categories.map((category) => ({
        ...category,
        quota: String(category.quota),
        price: String(category.price),
      })),
    });
    setIsFormOpen(true);
  }

  function submitEvent(event) {
    event.preventDefault();
    const payload = {
      event_id: form.event_id || crypto.randomUUID(),
      event_datetime: makeDateTime(form.date, form.time),
      event_title: form.event_title,
      venue_id: form.venue_id,
      organizer_id: form.organizer_id,
      artist_ids: form.artist_ids,
      description: form.description,
      ticket_categories: form.ticket_categories
        .filter((category) => category.category_name)
        .map((category) => ({
          category_name: category.category_name,
          quota: Number(category.quota),
          price: Number(category.price),
        })),
    };

    const nextEvents = form.event_id
      ? events.map((item) => (item.event_id === form.event_id ? payload : item))
      : [payload, ...events];

    persist(nextEvents);
    setIsFormOpen(false);
    setForm(emptyEvent);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
              {canManage ? "Acara Saya" : "Jelajahi Acara"}
            </p>
            <h1 className="text-3xl font-bold text-slate-950">{canManage ? "Acara Saya" : "Jelajahi Acara"}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Data event mengikuti tabel EVENT dan relasinya ke VENUE, ORGANIZER, ARTIST, dan TICKET_CATEGORY.
            </p>
          </div>
          {canManage && (
            <button
              onClick={openCreateForm}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
            >
              + Buat Acara
            </button>
          )}
        </div>

        <div className="mb-5 grid gap-3 rounded border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_220px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
            placeholder="Cari judul acara atau nama artis"
          />
          <select
            value={venueFilter}
            onChange={(event) => setVenueFilter(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
          >
            <option value="">Semua Venue</option>
            {venues.map((venue) => (
              <option key={venue.venue_id} value={venue.venue_id}>
                {venue.venue_name}
              </option>
            ))}
          </select>
          <select
            value={artistFilter}
            onChange={(event) => setArtistFilter(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
          >
            <option value="">Semua Artis</option>
            {artists.map((artist) => (
              <option key={artist.artist_id} value={artist.artist_id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.event_id} event={event} canManage={canManage} onEdit={() => openEditForm(event)} />
          ))}
        </div>
      </section>

      {isFormOpen && (
        <EventModal
          form={form}
          setForm={setForm}
          onClose={() => setIsFormOpen(false)}
          onSubmit={submitEvent}
        />
      )}
    </main>
  );
}

function EventCard({ event, canManage, onEdit }) {
  const venue = venues.find((item) => item.venue_id === event.venue_id);
  const organizer = organizers.find((item) => item.organizer_id === event.organizer_id);
  const eventArtists = event.artist_ids
    .map((id) => artists.find((artist) => artist.artist_id === id))
    .filter(Boolean);
  const ticketPrices = event.ticket_categories.map((category) => category.price);
  const cheapestTicket = ticketPrices.length ? Math.min(...ticketPrices) : 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-purple-200 hover:shadow-md">
      <div className="relative h-32 bg-gradient-to-br from-purple-400 to-purple-500 p-5 text-white">
        <div className="absolute inset-0 bg-white/10 transition-opacity group-hover:opacity-0"></div>
        <div className="relative z-10 flex h-full flex-col justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-100">{organizer?.organizer_name}</p>
          <h2 className="line-clamp-2 text-xl font-bold leading-tight">{event.event_title}</h2>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="grid gap-2 text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-purple-400">📅</span>
            <span>{formatDateTime(event.event_datetime)}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-purple-400">📍</span>
            <span>{venue?.venue_name}, {venue?.city}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-purple-400">🎤</span>
            <span className="line-clamp-1">{eventArtists.map((artist) => artist.name).join(", ")}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-purple-400">🎟️</span>
            <span className="font-semibold text-slate-800">Mulai dari {formatCurrency(cheapestTicket)}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {event.ticket_categories.slice(0, 3).map((category) => (
            <span key={category.category_name} className="rounded-md bg-purple-50 px-2 py-1 text-[10px] font-semibold text-purple-600 ring-1 ring-inset ring-purple-200/50">
              {category.category_name}
            </span>
          ))}
        </div>
        
        <p className="line-clamp-2 text-xs text-slate-500 flex-1">{event.description}</p>
        
        <div className="mt-2 flex gap-2">
          <button className="flex-1 rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-600">
            Beli Tiket
          </button>
          {canManage && (
            <button
              onClick={onEdit}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-800"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function EventModal({ form, setForm, onClose, onSubmit }) {
  const isEdit = Boolean(form.event_id);

  function toggleArtist(artistId) {
    const selected = form.artist_ids.includes(artistId);
    setForm({
      ...form,
      artist_ids: selected
        ? form.artist_ids.filter((id) => id !== artistId)
        : [...form.artist_ids, artistId],
    });
  }

  function updateCategory(index, key, value) {
    const nextCategories = form.ticket_categories.map((category, itemIndex) =>
      itemIndex === index ? { ...category, [key]: value } : category
    );
    setForm({ ...form, ticket_categories: nextCategories });
  }

  function addCategory() {
    setForm({
      ...form,
      ticket_categories: [...form.ticket_categories, { category_name: "", quota: "", price: "" }],
    });
  }

  function removeCategory(index) {
    setForm({
      ...form,
      ticket_categories: form.ticket_categories.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4">
      <form onSubmit={onSubmit} className="my-8 w-full max-w-4xl rounded bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">{isEdit ? "Edit Acara" : "Buat Acara Baru"}</h2>
            <p className="text-sm text-slate-500">Isi data acara, venue, performer, kategori tiket, dan deskripsi.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100">
            X
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Judul Acara">
            <input required value={form.event_title} onChange={(event) => setForm({ ...form, event_title: event.target.value })} className="input" />
          </Field>
          <Field label="Venue">
            <select required value={form.venue_id} onChange={(event) => setForm({ ...form, venue_id: event.target.value })} className="input">
              {venues.map((venue) => (
                <option key={venue.venue_id} value={venue.venue_id}>
                  {venue.venue_name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tanggal">
            <input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="input" />
          </Field>
          <Field label="Waktu">
            <input required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className="input" />
          </Field>

          <Field label="Deskripsi">
            <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="input min-h-24" />
          </Field>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">Artis / Performer</p>
          <div className="flex flex-wrap gap-2">
            {artists.map((artist) => (
              <button
                type="button"
                key={artist.artist_id}
                onClick={() => toggleArtist(artist.artist_id)}
                className={`rounded border px-3 py-2 text-sm font-bold ${
                  form.artist_ids.includes(artist.artist_id)
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {artist.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Kategori Tiket</p>
            <button type="button" onClick={addCategory} className="rounded px-3 py-1 text-sm font-bold text-blue-700 hover:bg-blue-50">
              + Tambah Kategori
            </button>
          </div>
          <div className="space-y-2">
            {form.ticket_categories.map((category, index) => (
              <div key={index} className="grid gap-2 md:grid-cols-[1fr_120px_160px_40px]">
                <input required value={category.category_name} onChange={(event) => updateCategory(index, "category_name", event.target.value)} className="input" placeholder="VIP" />
                <input required min="1" type="number" value={category.quota} onChange={(event) => updateCategory(index, "quota", event.target.value)} className="input" placeholder="100" />
                <input required min="0" type="number" value={category.price} onChange={(event) => updateCategory(index, "price", event.target.value)} className="input" placeholder="150000" />
                <button type="button" onClick={() => removeCategory(index)} className="rounded border border-red-200 text-sm font-bold text-red-700 hover:bg-red-50">
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border border-slate-300 px-4 py-2 text-sm font-bold">
            Batal
          </button>
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
            {isEdit ? "Simpan" : "Buat Acara"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">{label}</span>
      {children}
    </label>
  );
}
