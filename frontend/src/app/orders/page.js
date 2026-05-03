"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import { orders as orderSeed } from "../../lib/seedData";

export default function OrdersPage() {
  const [role, setRole] = useState("customer");
  const [orders, setOrders] = useState(orderSeed);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [modalUpdate, setModalUpdate] = useState(null);
  const [modalHapus, setModalHapus] = useState(null);
  const [newStatus, setNewStatus] = useState("lunas");

  useEffect(() => {
    const saved = window.localStorage.getItem("basdead-role");
    if (saved) setRole(saved);
    const listener = (e) => setRole(e.detail);
    window.addEventListener("basdead-role-change", listener);
    return () => window.removeEventListener("basdead-role-change", listener);
  }, []);

  const filteredOrders = useMemo(() => {
    let data = orders;
    if (role === "customer") {
      data = data.filter(o => o.customer_id === "cust_001");
    } else if (role === "organizer") {
      data = data.filter(o => ["ord_001", "ord_002", "ord_003"].includes(o.order_id));
    }
    if (search) {
      data = data.filter(o =>
        o.order_id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterStatus !== "semua") {
      data = data.filter(o => o.payment_status === filterStatus);
    }
    return data;
  }, [orders, role, search, filterStatus]);

  const stats = useMemo(() => {
    const base = role === "customer"
      ? orders.filter(o => o.customer_id === "cust_001")
      : role === "organizer"
      ? orders.filter(o => ["ord_001", "ord_002", "ord_003"].includes(o.order_id))
      : orders;
    return {
      total: base.length,
      lunas: base.filter(o => o.payment_status === "lunas").length,
      pending: base.filter(o => o.payment_status === "pending").length,
      revenue: base.filter(o => o.payment_status === "lunas").reduce((a, b) => a + b.total_amount, 0),
    };
  }, [orders, role]);

  function simpanUpdate() {
    setOrders(prev => prev.map(o =>
      o.order_id === modalUpdate ? { ...o, payment_status: newStatus } : o
    ));
    setModalUpdate(null);
  }

  function konfirmasiHapus() {
    setOrders(prev => prev.filter(o => o.order_id !== modalHapus));
    setModalHapus(null);
  }

  function formatRp(n) {
    return "Rp " + n.toLocaleString("id-ID");
  }

  function formatDate(str) {
    return new Date(str).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  }

  function Badge({ status }) {
    const map = {
      lunas: "bg-green-50 text-green-700 border border-green-200",
      pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      dibatalkan: "bg-red-50 text-red-700 border border-red-200",
    };
    const label = {
      lunas: "✓ LUNAS",
      pending: "⏳ PENDING",
      dibatalkan: "✕ DIBATALKAN",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
        {label[status]}
      </span>
    );
  }

  const subPerRole = {
    customer: "Riwayat pembelian tiket Anda",
    organizer: "Order dari event yang Anda selenggarakan",
    admin: "Semua order yang terdaftar di sistem",
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-purple-500 transition-colors bg-white";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040] px-8 pt-7 pb-5 text-white">
        <div className="text-2xl font-bold">Daftar Order</div>
        <div className="text-sm text-purple-400 mt-1">{subPerRole[role]}</div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-7">

        {/* STAT CARDS */}
        <div className={`grid gap-4 mb-6 ${role === "customer" ? "grid-cols-3" : "grid-cols-4"}`}>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-l-4 border-l-purple-500">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Order</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-l-4 border-l-green-500">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Lunas</div>
            <div className="text-3xl font-bold">{stats.lunas}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-l-4 border-l-yellow-500">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pending</div>
            <div className="text-3xl font-bold">{stats.pending}</div>
          </div>
          {role !== "customer" && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-l-4 border-l-purple-400">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Revenue</div>
              <div className="text-3xl font-bold text-purple-600">{formatRp(stats.revenue)}</div>
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Cari order ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-purple-500 transition-colors bg-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-purple-500 transition-colors bg-white w-44"
          >
            <option value="semua">Semua Status</option>
            <option value="lunas">Lunas</option>
            <option value="pending">Pending</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040]">
                <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Order ID</th>
                {role !== "customer" && <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Pelanggan</th>}
                <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Tanggal</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Total</th>
                {role === "admin" && <th className="px-5 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-slate-400 py-10">Tidak ada data</td>
                </tr>
              ) : filteredOrders.map(o => (
                <tr key={o.order_id} className="border-b border-slate-100 hover:bg-purple-50 transition-all">
                  <td className="px-5 py-4 font-mono font-semibold text-purple-600 text-sm">{o.order_id}</td>
                  {role !== "customer" && (
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 bg-purple-500">
                          {o.customer_name[0]}
                        </div>
                        {o.customer_name}
                      </div>
                    </td>
                  )}
                  <td className="px-5 py-4 text-slate-500 text-sm">{formatDate(o.order_date)}</td>
                  <td className="px-5 py-4"><Badge status={o.payment_status} /></td>
                  <td className="px-5 py-4 font-semibold">{formatRp(o.total_amount)}</td>
                  {role === "admin" && (
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setModalUpdate(o.order_id); setNewStatus(o.payment_status); }}
                          className="px-3 py-1.5 border-2 border-purple-500 text-purple-500 rounded-lg text-xs font-semibold hover:bg-purple-500 hover:text-white transition-all">
                          ✏ Update
                        </button>
                        <button
                          onClick={() => setModalHapus(o.order_id)}
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

      {/* MODAL UPDATE */}
      {modalUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl border border-slate-200">
            <div className="text-lg font-bold mb-1">Update Status Order</div>
            <div className="text-sm text-slate-400 mb-5">
              Order ID: <span className="font-mono font-semibold text-purple-600">{modalUpdate}</span>
            </div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Payment Status</label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className={`${inputClass} mb-6`}
            >
              <option value="lunas">Lunas</option>
              <option value="pending">Pending</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setModalUpdate(null)} className="px-5 py-2 border-2 border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50">Batal</button>
              <button onClick={simpanUpdate} className="px-5 py-2 rounded-xl font-semibold text-sm text-white bg-purple-500 hover:bg-purple-600 transition-all">
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl border border-slate-200">
            <div className="text-lg font-bold text-red-500 mb-2">Hapus Order</div>
            <p className="text-sm text-slate-500 mb-6">Apakah Anda yakin ingin menghapus catatan order ini? Tindakan ini tidak dapat dibatalkan.</p>
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