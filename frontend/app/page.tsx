import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <span className="text-green-400 font-mono font-bold text-lg tracking-wide">
          ALICE-Auth-SaaS
        </span>
        <Link
          href="/dashboard/console"
          className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded text-sm font-semibold transition-colors"
        >
          Dashboard
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <span className="text-green-400 font-mono text-sm uppercase tracking-widest mb-4">
          Project A.L.I.C.E.
        </span>
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          Zero-Knowledge<br />
          <span className="text-green-400">Authentication</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mb-10">
          Ed25519 / Schnorr Zero-Knowledge Proof authentication, TOTP-based MFA
          with backup codes, and Argon2id password hashing — all delivered as a
          single drop-in API with no secrets stored server-side.
        </p>
        <div className="flex gap-4">
          <Link
            href="/dashboard/console"
            className="px-7 py-3 bg-green-700 hover:bg-green-600 rounded-lg font-semibold text-lg transition-colors"
          >
            Open Console
          </Link>
          <a
            href="#features"
            className="px-7 py-3 border border-gray-700 hover:border-green-500 rounded-lg font-semibold text-lg text-gray-300 hover:text-white transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14 text-green-300">
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-7 border border-gray-700">
            <div className="text-green-400 text-3xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-2">Zero-Knowledge Proofs</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ed25519 and Schnorr ZKP schemes let users prove identity without
              revealing credentials. The server never sees a password or private
              key — authentication is mathematically verified, not trusted.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-7 border border-gray-700">
            <div className="text-green-400 text-3xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">TOTP MFA + Backup Codes</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enroll TOTP in one API call: receive a QR code URI, a shared
              secret, and ten single-use backup codes. Compatible with any
              RFC 6238 authenticator app.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-7 border border-gray-700">
            <div className="text-green-400 text-3xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Argon2id Password Hashing</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Memory-hard Argon2id hashing with configurable time, memory and
              parallelism parameters. Resists GPU and ASIC brute-force attacks
              at the current state of the art.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm py-8 border-t border-gray-800">
        ALICE-Auth-SaaS — Project A.L.I.C.E. &mdash; AGPL-3.0-or-later
      </footer>
    </div>
  );
}
