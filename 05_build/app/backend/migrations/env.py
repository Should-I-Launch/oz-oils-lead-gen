import importlib
import importlib.util
import pkgutil
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

from app.shared.base_model import Base
from app.shared.config import settings
import app.features as features_pkg

# Auto-import every features/<name>/models.py so its tables register on Base.metadata
for _, name, ispkg in pkgutil.iter_modules(features_pkg.__path__):
    if not ispkg:
        continue
    module_name = f"app.features.{name}.models"
    if importlib.util.find_spec(module_name) is not None:
        importlib.import_module(module_name)

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

config.set_main_option("sqlalchemy.url", settings.database_url)
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
