"""PersonaForge API package initialization."""

import os
from dotenv import load_dotenv, find_dotenv

# Load environment variables from a `.env` file if present. By default the
# closest `.env` discovered via ``find_dotenv`` is used, but the location can be
# overridden by defining an ``ENV_FILE`` environment variable. This makes it
# possible to point the backend at different configuration files without
# modifying the code.
load_dotenv(os.environ.get("ENV_FILE", find_dotenv()))
