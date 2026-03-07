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

  const username = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <nav className="fixed top-2 inset-x-2 z-50">
      <div className="max-w-7xl mx-auto glass px-4 py-2.5 rounded-xl flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          TodoApp
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-300 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-xs font-bold capitalize">{username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 active:scale-95 transition-all hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="text-sm px-4 py-2 bg-white text-black font-bold rounded-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
