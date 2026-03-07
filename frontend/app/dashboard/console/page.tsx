"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

type Tab = "auth" | "zkp" | "mfa" | "stats";

export default function ConsolePage() {
  const [tab, setTab] = useState<Tab>("auth");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // auth tab
  const [authPayload, setAuthPayload] = useState(
    JSON.stringify(
      { scheme: "argon2id", identifier: "alice@example.com", credential: "s3cur3P@ssw0rd!" },
      null,
      2
    )
  );
  const [verifyPayload, setVerifyPayload] = useState(
    JSON.stringify(
      { token: "eyJhbGciOiJFZERTQSJ9.example.signature" },
      null,
      2
    )
  );

  // zkp tab
  const [zkpChallengePayload, setZkpChallengePayload] = useState(
    JSON.stringify(
      { scheme: "schnorr", public_key: "ed25519:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" },
      null,
      2
    )
  );
  const [zkpProvePayload, setZkpProvePayload] = useState(
    JSON.stringify(
      { challenge_id: "chall_01JXXXXXXXXXXXXXXXX", proof: "base64encodedProof==" },
      null,
      2
    )
  );

  // mfa tab
  const [mfaPayload, setMfaPayload] = useState(
    JSON.stringify(
      { user_id: "user_01JXXXXXXXXXXXXXXXX", method: "totp", issuer: "ALICE-Auth" },
      null,
      2
    )
  );

  async function post(path: string, body: string) {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    } catch (e) {
      setResult(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  }

  async function get(path: string) {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API_BASE}${path}`);
      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    } catch (e) {
      setResult(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  }

  const tabs: Tab[] = ["auth", "zkp", "mfa", "stats"];

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-6 font-mono">
      <h1 className="text-2xl font-bold mb-6 text-green-300">
        ALICE-Auth-SaaS / Console
      </h1>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setResult(""); }}
            className={`px-4 py-2 rounded text-sm font-semibold uppercase tracking-wide transition-colors ${
              tab === t
                ? "bg-green-700 text-white"
                : "bg-gray-800 text-green-400 hover:bg-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* auth */}
      {tab === "auth" && (
        <div className="space-y-4">
          <p className="text-green-500 text-sm">
            POST /api/v1/auth/authenticate — authenticate with Argon2id password hashing
          </p>
          <textarea
            className="w-full h-36 bg-gray-800 border border-gray-700 rounded p-3 text-green-400 text-sm resize-y focus:outline-none focus:border-green-500"
            value={authPayload}
            onChange={(e) => setAuthPayload(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              onClick={() => post("/api/v1/auth/authenticate", authPayload)}
              disabled={loading}
              className="px-5 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-50 rounded text-white text-sm font-semibold"
            >
              {loading ? "Authenticating..." : "Authenticate"}
            </button>
            <button
              onClick={() => get("/api/v1/auth/schemes")}
              disabled={loading}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded text-green-300 text-sm font-semibold"
            >
              List Schemes
            </button>
          </div>

          <p className="text-green-500 text-sm pt-2">
            POST /api/v1/auth/verify — verify a JWT / session token
          </p>
          <textarea
            className="w-full h-28 bg-gray-800 border border-gray-700 rounded p-3 text-green-400 text-sm resize-y focus:outline-none focus:border-green-500"
            value={verifyPayload}
            onChange={(e) => setVerifyPayload(e.target.value)}
          />
          <button
            onClick={() => post("/api/v1/auth/verify", verifyPayload)}
            disabled={loading}
            className="px-5 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-50 rounded text-white text-sm font-semibold"
          >
            {loading ? "Verifying..." : "Verify Token"}
          </button>
        </div>
      )}

      {/* zkp */}
      {tab === "zkp" && (
        <div className="space-y-4">
          <p className="text-green-500 text-sm">
            POST /api/v1/auth/zkp/challenge — request a ZKP challenge (Ed25519 / Schnorr)
          </p>
          <textarea
            className="w-full h-36 bg-gray-800 border border-gray-700 rounded p-3 text-green-400 text-sm resize-y focus:outline-none focus:border-green-500"
            value={zkpChallengePayload}
            onChange={(e) => setZkpChallengePayload(e.target.value)}
          />
          <button
            onClick={() => post("/api/v1/auth/zkp/challenge", zkpChallengePayload)}
            disabled={loading}
            className="px-5 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-50 rounded text-white text-sm font-semibold"
          >
            {loading ? "Requesting..." : "Request Challenge"}
          </button>

          <p className="text-green-500 text-sm pt-2">
            POST /api/v1/auth/zkp/prove — submit ZKP proof to complete authentication
          </p>
          <textarea
            className="w-full h-32 bg-gray-800 border border-gray-700 rounded p-3 text-green-400 text-sm resize-y focus:outline-none focus:border-green-500"
            value={zkpProvePayload}
            onChange={(e) => setZkpProvePayload(e.target.value)}
          />
          <button
            onClick={() => post("/api/v1/auth/zkp/prove", zkpProvePayload)}
            disabled={loading}
            className="px-5 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-50 rounded text-white text-sm font-semibold"
          >
            {loading ? "Proving..." : "Submit Proof"}
          </button>
        </div>
      )}

      {/* mfa */}
      {tab === "mfa" && (
        <div className="space-y-4">
          <p className="text-green-500 text-sm">
            POST /api/v1/auth/mfa/setup — enroll TOTP with QR code + backup codes
          </p>
          <textarea
            className="w-full h-36 bg-gray-800 border border-gray-700 rounded p-3 text-green-400 text-sm resize-y focus:outline-none focus:border-green-500"
            value={mfaPayload}
            onChange={(e) => setMfaPayload(e.target.value)}
          />
          <button
            onClick={() => post("/api/v1/auth/mfa/setup", mfaPayload)}
            disabled={loading}
            className="px-5 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-50 rounded text-white text-sm font-semibold"
          >
            {loading ? "Setting up..." : "Setup MFA"}
          </button>
        </div>
      )}

      {/* stats */}
      {tab === "stats" && (
        <div className="space-y-4">
          <p className="text-green-500 text-sm">
            GET /api/v1/auth/stats — authentication events, ZKP proofs, and MFA enrollment metrics
          </p>
          <button
            onClick={() => get("/api/v1/auth/stats")}
            disabled={loading}
            className="px-5 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-50 rounded text-white text-sm font-semibold"
          >
            {loading ? "Loading..." : "Fetch Stats"}
          </button>
        </div>
      )}

      {/* result */}
      {result && (
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Response</p>
          <pre className="bg-gray-800 border border-gray-700 rounded p-4 text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
