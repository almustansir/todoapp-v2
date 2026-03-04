"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "Firebase: Error (auth/invalid-credential).":
        return "Incorrect email or password. Please try again.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STEP 1: Clear previous errors immediately
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // If successful, the redirect happens and the page unmounts
      router.push("/dashboard");
    } catch (err: any) {
      // STEP 2: Only set the error if the Firebase request fails
      setError(getFriendlyErrorMessage(err.message));
      // setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-black/50 border border-white/20 focus:border-blue-500 outline-none transition"
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(""); // Clear error while typing
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-black/50 border border-white/20 focus:border-blue-500 outline-none transition"
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(""); // Clear error while typing
            }}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <button
          type="button" // Ensure this doesn't trigger the form submit
          onClick={() => {
            setIsLogin(!isLogin);
            setError(""); // Clear error when switching modes
          }}
          className="w-full mt-6 text-sm text-gray-400 hover:text-white transition"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
