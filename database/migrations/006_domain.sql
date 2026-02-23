-- ALICE Auth: Domain-specific tables
CREATE TABLE IF NOT EXISTS auth_tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    default_scheme TEXT NOT NULL DEFAULT 'ed25519-zkp' CHECK (default_scheme IN ('ed25519-zkp', 'schnorr-zkp', 'password-argon2')),
    mfa_required BOOLEAN NOT NULL DEFAULT false,
    mau_count BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES auth_tenants(id) ON DELETE CASCADE,
    user_identifier TEXT NOT NULL,
    method TEXT NOT NULL,
    zkp_verified BOOLEAN NOT NULL DEFAULT false,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth_zkp_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES auth_tenants(id) ON DELETE CASCADE,
    user_identifier TEXT NOT NULL,
    scheme TEXT NOT NULL,
    challenge TEXT NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_auth_tenants_user ON auth_tenants(user_id);
CREATE INDEX idx_auth_sessions_tenant ON auth_sessions(tenant_id, expires_at);
CREATE INDEX idx_auth_zkp_challenges_tenant ON auth_zkp_challenges(tenant_id, expires_at);
