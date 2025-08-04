"""PersonaForge API package initialization."""

from dotenv import load_dotenv, find_dotenv

# Load environment variables from a `.env` file if present. This allows the
# backend to pick up configuration such as database URLs and secret keys when
# running outside of Docker.
load_dotenv(find_dotenv())
