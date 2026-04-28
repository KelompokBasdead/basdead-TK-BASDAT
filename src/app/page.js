import Navbar from "../Components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar mode="public" />

      <section className="relative flex-1 flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#141428] to-[#1a1040]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1)_0%,transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Platform Tiket Terpercaya
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
            Selamat Datang di <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              TikTakTuk
            </span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Temukan dan pesan tiket untuk berbagai acara, konser, dan pertunjukan favoritmu dengan mudah, cepat, dan aman.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:bg-purple-600 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:-translate-y-0.5"
            >
              Mulai Sekarang
            </Link>
            <Link 
              href="/events"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm transition-all hover:bg-white/10 hover:border-white/20"
            >
              Jelajahi Acara
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}