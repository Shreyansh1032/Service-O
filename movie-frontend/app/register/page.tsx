"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <Link href="/" className="font-display text-3xl tracking-wide text-cream">
          service<span className="text-marquee">-O</span>
        </Link>

        <h1 className="mt-8 font-display text-3xl tracking-wide text-cream">
          Join the audience
        </h1>
        <p className="mt-1 text-sm text-muted">Create an account to book your seats.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              Name
            </label>
            <input
              type="text"
              required
              minLength={3}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border border-border bg-panel px-3 py-2 text-cream outline-none transition-colors focus:border-marquee"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-border bg-panel px-3 py-2 text-cream outline-none transition-colors focus:border-marquee"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-border bg-panel px-3 py-2 text-cream outline-none transition-colors focus:border-marquee"
            />
          </div>

          {error && <p className="font-mono text-xs text-marquee">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-marquee py-3 font-mono text-sm uppercase tracking-wider text-cream transition-colors hover:bg-marquee-dim disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-spotlight hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
