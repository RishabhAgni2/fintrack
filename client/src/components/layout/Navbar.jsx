import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="h-16 border-b border-gray-800 bg-[#0b1220] flex items-center justify-between px-8">
      <h1 className="text-lg font-semibold text-gray-100">
        Portfolio Dashboard
      </h1>

      <div className="text-gray-400">
  Welcome, <span className="text-white">{user?.name}</span>
</div>
    </div>
  );
}
