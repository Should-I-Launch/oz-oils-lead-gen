"""Tests for admin endpoints with auth (dev mode — CLERK_SECRET_KEY unset)."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_admin_dashboard_dev_mode():
    """When Clerk is disabled, dev mock user has admin role."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/admin/dashboard")

    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "dev-user"
    assert data["role"] == "admin"


@pytest.mark.asyncio
async def test_current_user_dev_mode():
    """When Clerk is disabled, /admin/me returns dev mock user."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/admin/me")

    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "dev-user"
    assert data["role"] == "admin"
    assert data["is_admin"] is True
