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

  const username = user?.email?.split("@")[0] || "User";

  return (
    <nav className="fixed top-2 inset-x-2 z-50">
      {" "}
      {/* Reduced margin for mobile */}
      <div className="max-w-7xl mx-auto glass px-4 py-2.5 rounded-xl flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          Todo<span className="text-blue-500">App</span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Clickable Username Badge */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:bg-blue-400" />
                <span className="text-xs font-bold text-gray-200 capitalize tracking-wide">
                  {user?.email?.split("@")[0] || "User"}
                </span>
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
              className="text-xs px-4 py-2 rounded-lg bg-white text-black font-bold"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
