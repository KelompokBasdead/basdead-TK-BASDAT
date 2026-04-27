"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function ArtistsPage() {
  // 1. Add role state
  const [role, setRole] = useState("guest");
  
  const [artists, setArtists] = useState([
    { id: "80b3b8b1-02b6-42b5-9fb3-9c002c369deb", name: "Fourtwnty", genre: "Indie Folk" },
    { id: "2c626f2c-38ae-424c-b176-c735ebbef550", name: "Hindia", genre: "Indie Pop" },
    { id: "50bebb90-f825-4ade-96bd-e11a2847bdca", name: "Tulus", genre: "Pop" },
    { id: "6ee0a606-2ea0-4ee3-bc9b-4baf833931b4", name: "Nadin Amizah", genre: "Folk" },
    { id: "df2c481f-80da-44d3-b464-8e15c9d4d355", name: "Pamungkas", genre: "Singer-Songwriter" },
    { id: "1942c5ff-99b1-48f2-b861-2be84a6d2314", name: "Raisa", genre: "R&B / Pop" },
    { id: "54548c63-01b8-4204-9ec3-f0f2d29cf52b", name: "Dewa 19", genre: "Rock" },
    { id: "bb8e1d3c-1aa2-441c-99e3-4207ad8e5d3d", name: "Sheila On 7", genre: "Pop Rock" }
  ]);

  const [isModalOpen, setModalOpen] = useState(false);

  // 2. Add useEffect to synchronize the role with the global Navbar state
  useEffect(() => {
    const currentRole = window.localStorage.getItem("basdead-role") || "guest";
    setRole(currentRole);

    const handleRoleChange = (e) => setRole(e.detail);
    window.addEventListener("basdead-role-change", handleRoleChange);
    
    return () => window.removeEventListener("basdead-role-change", handleRoleChange);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 3. Make the Navbar mode dynamic based on the role */}
      <Navbar mode={role === "guest" ? "public" : "dashboard"} />

      <header className="bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040] py-10 px-6 text-center shadow-md">
        <h1 className="text-3xl font-bold text-white">Manajemen Artis</h1>
        <p className="mt-2 text-purple-200">Kelola daftar artis yang tampil di platform TikTakTuk</p>
      </header>

      <main className="mx-auto max-w-5xl py-10 px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Daftar Artis</h2>
          
          {/* 4. Conditionally render the Add button ONLY for Admin */}
          {role === "admin" && (
            <button 
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-600"
            >
              + Tambah Artis
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-900">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nama Artis</th>
                  <th className="px-6 py-4 font-semibold">Genre</th>
                  
                  {/* 5. Conditionally render the Action column header */}
                  {role === "admin" && (
                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr key={artist.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{artist.name}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-600">
                        {artist.genre}
                      </span>
                    </td>
                    
                    {/* 6. Conditionally render the Action buttons */}
                    {role === "admin" && (
                      <td className="px-6 py-4 text-right">
                        <button className="mr-3 font-medium text-purple-500 hover:text-purple-600">Edit</button>
                        <button className="font-medium text-red-500 hover:text-red-600">Hapus</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}