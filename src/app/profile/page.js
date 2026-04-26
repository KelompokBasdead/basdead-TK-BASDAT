"use client";

import { useState, useEffect } from "react";
import Navbar from "@/Components/Navbar";

// ── Dummy user data per role ──────────────────────────────────────────────────
const DUMMY_USERS = {
  customer: {
    role: "customer",
    username: "customer1",
    full_name: "Budi Santoso",
    phone_number: "+62812345678",
    avatar: "B",
    roleLabel: "Pelanggan",
  },
  organizer: {
    role: "organizer",
    username: "organizer1",
    organizer_name: "Andi Wijaya",
    contact_email: "organizer1@example.com",
    avatar: "A",
    roleLabel: "Penyelenggara",
  },
  admin: {
    role: "admin",
    username: "admin1",
    full_name: "Admin Utama",
    email: "admin@tiktaktuk.id",
    avatar: "A",
    roleLabel: "Administrator",
  },
};

export default function ProfilePage() {
  const [role, setRole] = useState("customer");
  const [user, setUser] = useState(DUMMY_USERS["customer"]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [editSuccess, setEditSuccess] = useState("");

  const [pwData, setPwData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  // ── Baca role dari localStorage saat mount ────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("basdead-role");
    const activeRole = saved && DUMMY_USERS[saved] ? saved : "customer";
    applyRole(activeRole);

    // Dengerin event dari Navbar
    const handler = (e) => {
      const r = e.detail;
      if (DUMMY_USERS[r]) applyRole(r);
    };
    window.addEventListener("basdead-role-change", handler);
    return () => window.removeEventListener("basdead-role-change", handler);
  }, []);

  function applyRole(r) {
    const u = DUMMY_USERS[r];
    setRole(r);
    setUser(u);
    setEditData({
      full_name: u.full_name || u.organizer_name || "",
      phone_number: u.phone_number || "",
      contact_email: u.contact_email || "",
    });
    setIsEditing(false);
    setPwError("");
    setPwSuccess("");
    setEditSuccess("");
  }

  // ── Role switcher handler (untuk demo/testing) ────────────────────────────
  function handleRoleSwitch(r) {
    applyRole(r);
    // Sync ke Navbar supaya ikut berubah
    window.localStorage.setItem("basdead-role", r);
    window.dispatchEvent(new CustomEvent("basdead-role-change", { detail: r }));
  }

  // ── Save profil ───────────────────────────────────────────────────────────
  function handleSave() {
    if (!editData.full_name?.trim()) return;
    setIsEditing(false);
    setEditSuccess("Profil berhasil diperbarui.");
    setTimeout(() => setEditSuccess(""), 3000);
  }

  // ── Update password ───────────────────────────────────────────────────────
  function handlePwSubmit(e) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (!pwData.old_password || !pwData.new_password || !pwData.confirm_password) {
      setPwError("Semua field wajib diisi.");
      return;
    }
    if (pwData.new_password.length < 6) {
      setPwError("Password baru minimal 6 karakter.");
      return;
    }
    if (pwData.new_password !== pwData.confirm_password) {
      setPwError("Konfirmasi password tidak cocok.");
      return;
    }
    setPwSuccess("Password berhasil diperbarui.");
    setPwData({ old_password: "", new_password: "", confirm_password: "" });
    setTimeout(() => setPwSuccess(""), 3000);
  }

  // ── Styling per role ──────────────────────────────────────────────────────
  const avatarBg =
    role === "customer"
      ? "bg-blue-500"
      : role === "organizer"
      ? "bg-purple-500"
      : "bg-purple-700";

  const badgeStyle =
    role === "customer"
      ? "bg-blue-100 text-blue-700"
      : role === "organizer"
      ? "bg-purple-100 text-purple-700"
      : "bg-slate-100 text-slate-700";

  // ── Fields per role ───────────────────────────────────────────────────────
  function renderFields() {
    if (role === "customer") {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <Field label="👤 Nama Lengkap">
              {isEditing ? (
                <EditInput
                  value={editData.full_name}
                  onChange={(v) => setEditData({ ...editData, full_name: v })}
                />
              ) : (
                <Value>{user.full_name}</Value>
              )}
            </Field>
            <Field label="📞 Nomor Telepon">
              {isEditing ? (
                <EditInput
                  value={editData.phone_number}
                  onChange={(v) => setEditData({ ...editData, phone_number: v })}
                />
              ) : (
                <Value>{user.phone_number}</Value>
              )}
            </Field>
          </div>
          <UsernameRow username={user.username} />
        </>
      );
    }

    if (role === "organizer") {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <Field label="🏢 Nama Organizer">
              {isEditing ? (
                <EditInput
                  value={editData.full_name}
                  onChange={(v) => setEditData({ ...editData, full_name: v })}
                />
              ) : (
                <Value>{user.organizer_name}</Value>
              )}
            </Field>
            <Field label="✉️ Contact Email">
              {isEditing ? (
                <EditInput
                  value={editData.contact_email}
                  onChange={(v) => setEditData({ ...editData, contact_email: v })}
                />
              ) : (
                <Value>{user.contact_email}</Value>
              )}
            </Field>
          </div>
          <UsernameRow username={user.username} />
        </>
      );
    }

    // Admin — read only
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <Field label="👤 Nama Lengkap">
            <Value>{user.full_name}</Value>
          </Field>
          <Field label="✉️ Email">
            <Value>{user.email}</Value>
          </Field>
        </div>
        <UsernameRow username={user.username} />
      </>
    );
  }

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* Page title + Role Switcher (hapus switcher ini kalau sudah ada login beneran) */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
            <p className="text-sm text-slate-400 mt-1">
              Kelola informasi pribadi dan preferensi akun Anda
            </p>
          </div>

          {/* ── ROLE SWITCHER — hapus blok ini kalau sudah ada login beneran ── */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {["customer", "organizer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => handleRoleSwitch(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize ${
                  role === r
                    ? "bg-white shadow text-purple-700 border border-purple-100"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {/* ── END ROLE SWITCHER ── */}
        </div>

        {/* ── Card: Informasi Profil ── */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-5 transition-all hover:border-purple-200 hover:shadow-md">
          {/* Card header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Informasi Profil</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola data pribadi Anda di platform TikTakTuk
              </p>
            </div>

            {/* Tombol Edit — hanya untuk customer & organizer */}
            {role !== "admin" && (
              <div className="flex gap-2 shrink-0">
                {!isEditing ? (
                  <button
                    onClick={() => { setIsEditing(true); setEditSuccess(""); }}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-purple-300 hover:text-purple-600 transition"
                  >
                    ✏️ Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setIsEditing(false); applyRole(role); }}
                      className="text-sm font-medium text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      className="text-sm font-semibold bg-purple-500 hover:bg-purple-600 text-white px-4 py-1.5 rounded-lg transition"
                    >
                      Simpan
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100" />

          {/* Avatar */}
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ${avatarBg}`}
          >
            {user.avatar}
          </div>

          {/* Role badge */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-400">Role / Peran</span>
            <span
              className={`inline-block w-fit text-xs font-semibold px-3 py-1 rounded-full ${badgeStyle}`}
            >
              {user.roleLabel}
            </span>
          </div>

          {/* Success banner edit profil */}
          {editSuccess && (
            <div className="bg-purple-50 border border-purple-200 text-purple-700 text-sm px-4 py-2.5 rounded-lg">
              ✓ {editSuccess}
            </div>
          )}

          {/* Fields */}
          {renderFields()}
        </div>

        {/* ── Card: Update Password ── */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-5 transition-all hover:border-purple-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-purple-400 text-lg">🔒</span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Update Password</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Perbarui password Anda untuk menjaga keamanan akun
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          <form onSubmit={handlePwSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600">Password Lama</label>
              <input
                type="password"
                placeholder="Password Lama"
                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={pwData.old_password}
                onChange={(e) => setPwData({ ...pwData, old_password: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600">Password Baru</label>
              <input
                type="password"
                placeholder="Password Baru"
                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={pwData.new_password}
                onChange={(e) => setPwData({ ...pwData, new_password: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                placeholder="Konfirmasi Password Baru"
                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={pwData.confirm_password}
                onChange={(e) =>
                  setPwData({ ...pwData, confirm_password: e.target.value })
                }
              />
            </div>

            {pwError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="bg-purple-50 border border-purple-200 text-purple-700 text-sm px-4 py-2.5 rounded-lg">
                ✓ {pwSuccess}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setPwData({ old_password: "", new_password: "", confirm_password: "" });
                  setPwError("");
                  setPwSuccess("");
                }}
                className="text-sm font-medium text-slate-500 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-sm font-semibold bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg transition"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      {children}
    </div>
  );
}

function Value({ children }) {
  return <span className="text-sm font-semibold text-slate-800">{children}</span>;
}

function EditInput({ value, onChange }) {
  return (
    <input
      className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function UsernameRow({ username }) {
  return (
    <div className="flex flex-col gap-1 mt-1">
      <span className="text-xs font-medium text-slate-400">👤 Username</span>
      <span className="text-sm font-semibold text-slate-500">@{username}</span>
      <span className="text-xs text-slate-300">Username tidak dapat diubah.</span>
    </div>
  );
}