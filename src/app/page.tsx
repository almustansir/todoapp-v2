import Link from "next/link";

export default function Hero() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-extrabold mb-4">TodoApp v2</h1>
      <p className="text-xl text-gray-400 mb-8">
        Master your productivity with Next.js 14.
      </p>
      <Link
        href="/auth"
        className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
      >
        Get Started
      </Link>
    </main>
  );
}
