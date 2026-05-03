"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function ArtistsPage() {
  const [role, setRole] = useState("guest");
  
  // State untuk daftar artis
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

  // States untuk modal Add
  const [isModalOpen, setModalOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({ name: "", genre: "" });
  
  // States untuk modal Edit
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: "", name: "", genre: "" });
  
  // State untuk modal Delete
  const [artistToDelete, setArtistToDelete] = useState(null);

  useEffect(() => {
    const currentRole = window.localStorage.getItem("basdead-role") || "guest";
    setRole(currentRole);
    
    const handleRoleChange = (e) => setRole(e.detail);
    window.addEventListener("basdead-role-change", handleRoleChange);
    
    return () => window.removeEventListener("basdead-role-change", handleRoleChange);
  }, []);

  // Handle Add
  const handleAddArtist = (e) => {
    e.preventDefault();
    if (!newArtist.name || !newArtist.genre) return;

    const newId = crypto.randomUUID(); 
    setArtists([{ id: newId, ...newArtist }, ...artists]);
    
    setNewArtist({ name: "", genre: "" });
    setModalOpen(false);
  };

  // Handle Edit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.genre) return;

    // Cari artis yang diedit berdasarkan ID, lalu timpa dengan data baru
    setArtists(
      artists.map((artist) => 
        artist.id === editFormData.id ? editFormData : artist
      )
    );

    setEditModalOpen(false);
  };

  // Handle Delete
  const handleDeleteConfirm = () => {
    if (!artistToDelete) return;
    setArtists(artists.filter(artist => artist.id !== artistToDelete.id));
    setArtistToDelete(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar mode={role === "guest" ? "public" : "dashboard"} />
      
      <header className="bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040] py-10 px-6 text-center shadow-md">
        <h1 className="text-3xl font-bold text-white">Manajemen Artis</h1>
        <p className="mt-2 text-purple-200">Kelola daftar artis yang tampil di platform TikTakTuk</p>
      </header>
      
      <main className="mx-auto max-w-5xl py-10 px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Daftar Artis</h2>
          
          {role === "admin" && (
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-600 transition-colors"
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
                    {role === "admin" && (
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            setEditFormData(artist); // Salin data artis ke state form
                            setEditModalOpen(true);  // Buka modal edit
                          }}
                          className="mr-3 font-medium text-purple-500 hover:text-purple-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setArtistToDelete(artist)}
                          className="font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                          Hapus
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Tambah Artis */}
      {isModalOpen && role === "admin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Tambah Artis Baru</h2>
              <button onClick={() => setModalOpen(false)} className="text-2xl leading-none text-slate-400 hover:text-slate-600 transition-colors">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleAddArtist} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">NAMA ARTIS *</label>
                <input
                  type="text"
                  required
                  value={newArtist.name}
                  onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                  placeholder="Contoh: Kunto Aji"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 transition-all focus:border-purple-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">GENRE *</label>
                <input
                  type="text"
                  required
                  value={newArtist.genre}
                  onChange={(e) => setNewArtist({ ...newArtist, genre: e.target.value })}
                  placeholder="Contoh: Pop Indie"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 transition-all focus:border-purple-400 focus:outline-none"
                />
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className="rounded-xl px-5 py-2.5 font-semibold text-slate-600 transition-all hover:bg-slate-100"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="rounded-xl bg-purple-500 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-purple-600"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Artis */}
      {isEditModalOpen && role === "admin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Edit Artis</h2>
              <button onClick={() => setEditModalOpen(false)} className="text-2xl leading-none text-slate-400 hover:text-slate-600 transition-colors">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">NAMA ARTIS *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 transition-all focus:border-purple-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">GENRE *</label>
                <input
                  type="text"
                  required
                  value={editFormData.genre}
                  onChange={(e) => setEditFormData({ ...editFormData, genre: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 transition-all focus:border-purple-400 focus:outline-none"
                />
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditModalOpen(false)} 
                  className="rounded-xl px-5 py-2.5 font-semibold text-slate-600 transition-all hover:bg-slate-100"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="rounded-xl bg-purple-500 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-purple-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Artis */}
      {artistToDelete && role === "admin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-xl font-bold text-red-600">Hapus Artis</h2>
            <p className="mb-6 text-sm text-slate-600">
              Apakah Anda yakin ingin menghapus <strong className="text-slate-800">{artistToDelete.name}</strong> dari daftar? Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setArtistToDelete(null)} 
                className="rounded-xl px-5 py-2.5 font-semibold text-slate-600 transition-all hover:bg-slate-100"
              >
                Batal
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                className="rounded-xl bg-red-500 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}