"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { users } from "../../lib/seedData";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      setError("Username atau password salah.");
      return;
    }

    window.localStorage.setItem("basdead-role", user.role);
    window.dispatchEvent(new CustomEvent("basdead-role-change", { detail: user.role }));
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040] flex flex-col">
      <Navbar mode="public" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
              TT
            </div>
            <div className="text-2xl font-bold text-white">TikTakTuk</div>
            <div className="text-sm text-purple-300 mt-1">Platform Manajemen Pertunjukan & Tiket</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-200">
            <div className="font-bold text-lg text-slate-900 mb-1">Masuk ke Akun Anda</div>
            <div className="text-sm text-slate-400 mb-6">Gunakan kredensial Anda untuk mengakses platform</div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                placeholder="Masukkan username"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-purple-500 transition-colors bg-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Masukkan password"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-purple-500 transition-colors bg-white"
              />
            </div>

            {error && (
              <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm transition-all">
              Masuk
            </button>
          </div>

          <div className="text-center mt-6 text-sm text-purple-300">
            Belum punya akun?{" "}
            <Link href="/register" className="text-purple-400 font-semibold hover:text-white transition-colors">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}