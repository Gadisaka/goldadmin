"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const isActive = (path) => pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white ${
          isCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && <h1 className="text-xl font-bold">Gold Bingo</h1>}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded hover:bg-gray-700"
            >
              {isCollapsed ? "→" : "←"}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={`flex items-center p-3 rounded transition-colors ${
                  isActive("/") ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`}
              >
                <span className="text-xl mr-3">📊</span>
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/vouchers"
                className={`flex items-center p-3 rounded transition-colors ${
                  isActive("/vouchers")
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                <span className="text-xl mr-3">🎫</span>
                {!isCollapsed && <span>Vouchers</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer with Logout - Always at bottom */}
        <div className="mt-auto p-4 border-t border-gray-700">
          {user && !isCollapsed && (
            <div className="mb-3 p-2 bg-gray-700 rounded text-sm">
              <p className="text-gray-300">Logged in as:</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center w-full p-3 rounded hover:bg-gray-700 transition-colors text-red-400 hover:text-red-300"
          >
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
