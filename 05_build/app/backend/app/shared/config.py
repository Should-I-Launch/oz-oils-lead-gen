from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    postgres_user: str = "postgres"
    postgres_password: str = "postgres"
    postgres_db: str = "app"
    postgres_host: str = "db"
    postgres_port: int = 5432
    debug: bool = False
    log_level: str = "INFO"

    # Clerk auth — leave empty to disable auth enforcement
    clerk_secret_key: str = ""
    clerk_jwks_url: str = "https://api.clerk.com/v1/jwks"

    @property
    def clerk_enabled(self) -> bool:
        return bool(self.clerk_secret_key)

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


settings = Settings()
