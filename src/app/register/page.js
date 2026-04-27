"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [roleSelection, setRoleSelection] = useState(null);

  const handleRegister = (e) => {
    e.preventDefault();
    // Submit registration to backend here
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar mode="public" />

      <main className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-purple-200 hover:shadow-md">
          {!roleSelection ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-slate-900">Daftar untuk Memulai</h1>
                <p className="mt-2 text-sm text-slate-500">Pilih jenis akun yang sesuai dengan kebutuhan Anda</p>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={() => setRoleSelection('customer')}
                  className="w-full rounded-xl border border-slate-200 p-4 text-left transition-all hover:border-purple-500 hover:bg-purple-50"
                >
                  <h3 className="font-semibold text-slate-900">👤 Pelanggan</h3>
                  <p className="mt-1 text-sm text-slate-500">Beli dan kelola tiket untuk acara favorit Anda</p>
                </button>
                <button 
                  onClick={() => setRoleSelection('organizer')}
                  className="w-full rounded-xl border border-slate-200 p-4 text-left transition-all hover:border-purple-500 hover:bg-purple-50"
                >
                  <h3 className="font-semibold text-slate-900">🏢 Penyelenggara</h3>
                  <p className="mt-1 text-sm text-slate-500">Buat dan kelola acara serta venue Anda</p>
                </button>
              </div>
              <p className="mt-6 text-center text-sm text-slate-600">
                Sudah punya akun? <Link href="/login" className="font-semibold text-purple-500 hover:text-purple-600">Login di sini</Link>
              </p>
            </>
          ) : (
            <>
              <button 
                onClick={() => setRoleSelection(null)}
                className="mb-6 text-sm font-medium text-purple-500 hover:text-purple-600"
              >
                &larr; Kembali
              </button>
              <h2 className="mb-6 text-xl font-bold text-slate-900">Daftar sebagai {roleSelection === 'customer' ? 'Pelanggan' : 'Penyelenggara'}</h2>
              
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Form fields standardized */}
                {['Nama Lengkap', 'Email', 'Nomor Telepon', 'Username', 'Password', 'Konfirmasi Password'].map((field) => (
                  <div key={field}>
                    <label className="mb-1 block text-sm font-medium text-slate-700">{field}</label>
                    <input
                      type={field.toLowerCase().includes('password') ? 'password' : 'text'}
                      required
                      placeholder={`Masukkan ${field.toLowerCase()}`}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                ))}
                
                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-purple-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-600"
                >
                  Daftar
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}