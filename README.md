# ALICE-Auth-SaaS

Zero-knowledge authentication platform built on Project A.L.I.C.E. — Ed25519
and Schnorr ZKP authentication, TOTP-based MFA with backup codes, Argon2id
password hashing, and JWT token verification through a single REST API.
No credentials are stored server-side.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                     │
│           Landing Page  │  Dashboard Console            │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────┐
│               Auth API (Rust / Axum)                    │
│  /authenticate  /verify  /zkp/challenge  /zkp/prove     │
│  /mfa/setup     /schemes  /stats                        │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              ALICE-Auth Engine (Rust)                   │
│  ZKP (Ed25519 / Schnorr)  │  Argon2id Password Hashing │
│  TOTP RFC 6238            │  JWT (EdDSA signing)        │
│  Backup Code Generator    │  Rate Limiting              │
└─────────────────────────────────────────────────────────┘
```

## Features

| Feature | Description |
|---------|-------------|
| ZKP Authentication | Ed25519 and Schnorr proofs — server never sees private keys |
| Argon2id Hashing | Memory-hard password hashing with tunable parameters |
| TOTP MFA | RFC 6238 TOTP enrollment with QR code URI and backup codes |
| Token Verification | EdDSA-signed JWT verification with expiry and revocation |
| Multiple Schemes | Password, ZKP, passkey — selectable per request |
| Auth Statistics | Login events, ZKP proofs, MFA usage aggregated per window |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/authenticate` | Authenticate with a credential (password, passkey) |
| POST | `/api/v1/auth/verify` | Verify a JWT or session token |
| POST | `/api/v1/auth/zkp/challenge` | Request a ZKP challenge nonce |
| POST | `/api/v1/auth/zkp/prove` | Submit a ZKP proof to complete authentication |
| POST | `/api/v1/auth/mfa/setup` | Enroll TOTP and receive QR code + backup codes |
| GET | `/api/v1/auth/schemes` | List supported authentication schemes |
| GET | `/api/v1/auth/stats` | Authentication event and MFA enrollment statistics |

## Quick Start

```bash
# Clone and start the backend
git clone https://github.com/ext-sakamoro/ALICE-Auth-SaaS
cd ALICE-Auth-SaaS
cargo build --release
./target/release/alice-auth-server

# In a separate terminal, start the frontend
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Authenticate example

```bash
curl -X POST http://localhost:8081/api/v1/auth/authenticate \
  -H "Content-Type: application/json" \
  -d '{"scheme":"argon2id","identifier":"alice@example.com","credential":"s3cur3P@ssw0rd!"}'
```

### ZKP challenge example

```bash
# 1. Request challenge
curl -X POST http://localhost:8081/api/v1/auth/zkp/challenge \
  -H "Content-Type: application/json" \
  -d '{"scheme":"schnorr","public_key":"ed25519:AAAA..."}'

# 2. Submit proof
curl -X POST http://localhost:8081/api/v1/auth/zkp/prove \
  -H "Content-Type: application/json" \
  -d '{"challenge_id":"chall_01J...","proof":"base64encodedProof=="}'
```

### MFA setup example

```bash
curl -X POST http://localhost:8081/api/v1/auth/mfa/setup \
  -H "Content-Type: application/json" \
  -d '{"user_id":"user_01J...","method":"totp","issuer":"ALICE-Auth"}'
```

## License

AGPL-3.0-or-later — see [LICENSE](./LICENSE)
