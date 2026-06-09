"""Clerk JWT authentication dependencies for FastAPI."""

from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, Request, status
from jwt import PyJWKClient

from app.shared.config import settings

# Lazy-initialized JWKS client
_jwks_client: PyJWKClient | None = None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(settings.clerk_jwks_url, headers={"Authorization": f"Bearer {settings.clerk_secret_key}"})
    return _jwks_client


def _extract_token(request: Request) -> str | None:
    """Extract Bearer token from Authorization header."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    return auth_header[7:]


class ClerkUser:
    """Represents an authenticated Clerk user extracted from JWT claims."""

    def __init__(self, claims: dict):
        self.user_id: str = claims.get("sub", "")
        self.email: str = claims.get("email", "")
        # Clerk puts public metadata in the JWT under "public_metadata"
        public_metadata = claims.get("public_metadata", {}) or {}
        self.role: str = public_metadata.get("role", "")
        self.claims = claims

    @property
    def is_admin(self) -> bool:
        return self.role == "admin"


async def require_auth(request: Request) -> ClerkUser:
    """FastAPI dependency that validates Clerk JWT and returns the authenticated user.

    When CLERK_SECRET_KEY is not set, auth is bypassed and a mock user is returned
    to allow local development without Clerk.
    """
    if not settings.clerk_enabled:
        # Auth disabled — return a dev-mode mock user
        return ClerkUser({"sub": "dev-user", "email": "dev@localhost", "public_metadata": {"role": "admin"}})

    token = _extract_token(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        jwks_client = _get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return ClerkUser(claims)


async def require_admin(user: Annotated[ClerkUser, Depends(require_auth)]) -> ClerkUser:
    """FastAPI dependency that requires the authenticated user to have the admin role."""
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required",
        )
    return user


# Convenient type aliases for use in route signatures
AuthUser = Annotated[ClerkUser, Depends(require_auth)]
AdminUser = Annotated[ClerkUser, Depends(require_admin)]
