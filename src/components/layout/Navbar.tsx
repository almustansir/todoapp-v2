"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="fixed top-4 inset-x-4 z-50">
      <div className="max-w-7xl mx-auto glass px-6 py-3 rounded-2xl flex items-center justify-between">
        {/* Logo */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="text-xl font-bold tracking-tighter hover:opacity-80 transition"
        >
          Todo<span className="text-blue-500">App</span>
          <span className="text-xs ml-1 bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
            v2
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-300 hover:text-white transition"
              >
                Dashboard
              </Link>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs text-gray-400 font-mono">
                  {user.email?.split("@")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="text-sm font-medium text-gray-300 hover:text-white transition"
              >
                Home
              </Link>
              <Link
                href="/auth"
                className="text-sm px-5 py-2 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
