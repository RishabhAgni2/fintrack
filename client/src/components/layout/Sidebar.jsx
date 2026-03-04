import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard } from "lucide-react";

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-[#0f1b2d] border-r border-[#1f2937] flex flex-col">

      {/* Logo */}
      <div className="h-20 flex items-center px-8 text-2xl font-semibold text-white">
        FinTrack
      </div>

      {/* Navigation */}
      <div className="flex-1 px-6">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-4 rounded-2xl text-lg font-medium transition ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

      </div>

      {/* Logout */}
      <div className="px-6 pb-6">
        <button
          onClick={logout}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
        >
          Logout
        </button>
      </div>

    </div>
  );
}