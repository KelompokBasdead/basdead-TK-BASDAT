"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import { events, venues, artists } from "../../lib/seedData";

const seats = ["A1","A2","A3","A4","A5","B1","B2","B3","B4","B5","C1","C2"];
const promosValid = ["TIKTAK20", "HEMAT50K", "NEWUSER30"];

export default function CheckoutPage() {
  const event = events[0];
  const venue = venues.find(v => v.venue_id === event.venue_id);
  const eventArtists = artists.filter(a => event.artist_ids.includes(a.artist_id));

  const [selectedKategori, setSelectedKategori] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [selectedKursi, setSelectedKursi] = useState([]);
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState(null);

  const total = selectedKategori ? selectedKategori.price * jumlah : 0;

  function toggleKursi(kursi) {
    setSelectedKursi(prev =>
      prev.includes(kursi) ? prev.filter(k => k !== kursi) : [...prev, kursi]
    );
  }

  function terapkanPromo() {
    if (promosValid.includes(promoInput.toUpperCase())) {
      setPromoMsg({ text: "✅ Kode promo berhasil diterapkan!", ok: true });
    } else {
      setPromoMsg({ text: "Kode promo tidak valid.", ok: false });
    }
  }

  function bayar() {
    if (!selectedKategori) {
      alert("Pilih kategori tiket dulu!");
      return;
    }
    alert("Pesanan berhasil dibuat! Status: Pending");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040] px-8 pt-7 pb-5 text-white">
        <div className="text-sm text-purple-400 mb-1">
          <span className="font-semibold">Pilih</span> &gt; Bayar &gt; Selesai
        </div>
        <div className="text-2xl font-bold">Checkout Tiket</div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-7 grid grid-cols-[1fr_340px] gap-6">

        <div>
          {/* Info Event */}
          <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-slate-200">
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-purple-500">
                🎵
              </div>
              <div>
                <div className="text-lg font-bold mb-1">{event.event_title}</div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {eventArtists.map(a => (
                    <span key={a.artist_id} className="bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-0.5 rounded-full">
                      {a.name}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-slate-400">
                  📅 {event.event_datetime} &nbsp;&nbsp; 📍 {venue?.venue_name}, {venue?.city}
                </div>
              </div>
            </div>
          </div>

          {/* Kategori Tiket */}
          <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-slate-200">
            <div className="font-bold text-base mb-1">Pilih Kategori Tiket</div>
            <div className="text-sm text-slate-400 mb-4">Setiap kategori memiliki fasilitas berbeda</div>
            {event.ticket_categories.map((cat, i) => (
              <div key={i}
                onClick={() => setSelectedKategori(cat)}
                className={`flex justify-between items-center px-4 py-3 rounded-xl border-2 mb-2 cursor-pointer transition-all
                  ${selectedKategori?.category_name === cat.category_name
                    ? "border-purple-500 bg-purple-50"
                    : "border-slate-200 hover:border-purple-200 hover:shadow-md"}`}>
                <div>
                  <div className="font-semibold">{cat.category_name}</div>
                  <div className="text-xs text-slate-400">Kuota: {cat.quota} tiket</div>
                </div>
                <span className={`font-semibold ${selectedKategori?.category_name === cat.category_name ? "text-purple-600" : "text-slate-500"}`}>
                  Rp {cat.price.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          {/* Jumlah & Kursi */}
          <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-slate-200 grid grid-cols-2 gap-6">
            <div>
              <div className="font-bold mb-3">Jumlah Tiket</div>
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setJumlah(j => Math.max(1, j - 1))}
                  className="w-9 h-9 rounded-full border-2 border-purple-500 text-purple-500 font-bold text-xl flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all">
                  −
                </button>
                <span className="text-2xl font-bold">{jumlah}</span>
                <button onClick={() => setJumlah(j => Math.min(10, j + 1))}
                  className="w-9 h-9 rounded-full border-2 border-purple-500 text-purple-500 font-bold text-xl flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all">
                  +
                </button>
              </div>
              <div className="text-xs text-slate-400">Max 10 tiket per transaksi</div>
            </div>

            {venue?.has_reserved_seating && (
              <div>
                <div className="font-bold mb-3">Pilih Kursi</div>
                <div className="grid grid-cols-4 gap-2">
                  {seats.map(s => (
                    <button key={s} onClick={() => toggleKursi(s)}
                      className={`py-2 rounded-lg border-2 text-sm font-semibold transition-all
                        ${selectedKursi.includes(s)
                          ? "bg-purple-500 text-white border-purple-500"
                          : "border-slate-200 text-slate-500 hover:border-purple-400 hover:text-purple-500"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kode Promo */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="font-bold mb-3">Kode Promo</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={e => setPromoInput(e.target.value)}
                placeholder="CONTOH: TIKTAK20"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-purple-500 transition-colors bg-white flex-1"
              />
              <button onClick={terapkanPromo}
                className="px-5 py-2 bg-purple-500 text-white rounded-lg font-semibold text-sm hover:bg-purple-600 transition-all">
                Terapkan
              </button>
            </div>
            {promoMsg && (
              <div className={`text-sm mt-2 ${promoMsg.ok ? "text-green-600" : "text-red-500"}`}>
                {promoMsg.text}
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="sticky top-20">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-purple-500">
            <div className="font-bold text-base mb-4">Ringkasan Pesanan</div>
            <div className="flex justify-between text-sm text-slate-500 mb-2">
              <span>{selectedKategori ? `${selectedKategori.category_name} × ${jumlah}` : "-"}</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 mb-2">
              <span>Biaya Layanan</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t-2 border-dashed border-slate-100">
              <span>Total</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
            <button onClick={bayar}
              className="w-full py-3 mt-4 rounded-xl text-white font-bold text-base transition-all hover:bg-purple-600 bg-purple-500">
              Bayar Sekarang
            </button>
            <div className="text-xs text-slate-400 text-center mt-2">
              Konfirmasi tiket akan dikirim ke admin@example.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}