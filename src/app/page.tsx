"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Hero() {
  const { user } = useAuth();
  return (
    <main className="relative min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative background glow for mobile depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full -z-10" />

      {/* Main Content */}
      <div className="space-y-6 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-blue-400 font-bold animate-in fade-in zoom-in duration-700">
          TodoApp v2
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[1.1]">
          Master your <br />
          <span className="text-blue-500">Productivity.</span>
        </h1>

        <p className="text-base md:text-lg text-gray-400 max-w-[280px] md:max-w-md mx-auto leading-relaxed">
          A clean, scalable task manager built with Next.js 16 and Firebase.
          Fast as lightning on any device.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {/* <Link
            href="/auth"
            className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            Get Started
          </Link> */}

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 active:scale-95 transition-all shadow-xl shadow-white/5"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              href="/auth"
              className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 active:scale-95 transition-all shadow-xl shadow-white/5"
            >
              Get Started
            </Link>
          )}

          <a
            href="https://github.com/almustansir/todoapp-v2"
            target="_blank"
            className="w-full sm:w-auto px-10 py-4 glass rounded-2xl font-semibold hover:bg-white/10 active:scale-95 transition-all"
          >
            View GitHub
          </a>
        </div>
      </div>

      {/* Mobile-only status badge at the bottom */}
      <div className="absolute bottom-10 flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-tighter">
        <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
        Systems Operational
      </div>
    </main>
  );
}
