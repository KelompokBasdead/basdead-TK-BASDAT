import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="flex flex-col items-center justify-center pt-20 px-4 text-center">
        <h1 className="text-4xl font-black text-green-900 mb-4">
          Selamat Datang di Basdead
        </h1>
      </section>
    </main>
  );
}