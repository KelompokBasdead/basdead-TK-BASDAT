export default function Navbar() {
  return (
    <nav className="bg-green-800 p-4 text-white flex justify-between items-center shadow-lg">
      <div className="font-black text-xl">BASDEAD</div>
      <div className="flex gap-4 text-sm font-medium">
        <a href="/" className="hover:underline">Home</a>
        <a href="/login" className="hover:underline">Login</a>
        <a href="/register" className="hover:underline">Register</a>
      </div>
    </nav>
  );
}