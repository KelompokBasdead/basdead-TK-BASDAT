"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Replace with actual auth validation logic
    let role = "customer";
    if (username === "admin") role = "admin";
    if (username === "organizer") role = "organizer";

    // Required State Synchronization
    window.localStorage.setItem("basdead-role", role);
    window.dispatchEvent(new CustomEvent("basdead-role-change", { detail: role }));

    router.push("/events"); // Redirect aligned with Navbar
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar mode="public" />
      
      <main className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-purple-200 hover:shadow-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Masuk ke Akun Anda</h1>
            <p className="mt-2 text-sm text-slate-500">Gunakan kredensial Anda untuk mengakses platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-purple-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Masuk
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-purple-500 hover:text-purple-600">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}