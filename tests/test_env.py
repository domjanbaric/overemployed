from api.services import auth


def test_env_file_loaded():
    assert auth.SECRET_KEY == "changeme"
