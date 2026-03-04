"use client";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!user) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-12 glass p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold">TodoApp v2</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition"
        >
          Sign Out
        </button>
      </header>

      <main>
        <h2 className="text-4xl font-bold mb-4">My Tasks</h2>
        <div className="glass p-12 rounded-3xl border-dashed border-2 border-white/5 text-center">
          <p className="text-gray-500 italic">
            No tasks yet. Ready to be productive?
          </p>
          <button className="mt-4 px-6 py-2 bg-blue-600 rounded-full font-semibold">
            + Create First Task
          </button>
        </div>
      </main>
    </div>
  );
}
