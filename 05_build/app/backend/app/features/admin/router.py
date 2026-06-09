"""Admin-only endpoints demonstrating role-based access control."""

from fastapi import APIRouter

from app.shared.auth.dependencies import AdminUser, AuthUser

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard")
async def admin_dashboard(user: AdminUser):
    """Example admin-only endpoint. Requires the 'admin' role."""
    return {
        "message": "Welcome to the admin dashboard",
        "user_id": user.user_id,
        "email": user.email,
        "role": user.role,
    }


@router.get("/me")
async def current_user(user: AuthUser):
    """Example authenticated endpoint. Any logged-in user can access."""
    return {
        "user_id": user.user_id,
        "email": user.email,
        "role": user.role,
        "is_admin": user.is_admin,
    }
