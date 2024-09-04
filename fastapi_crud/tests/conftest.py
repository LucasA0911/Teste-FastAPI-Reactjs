import pytest
from fastapi.testclient import TestClient

from teste_tecnico.app import app


@pytest.fixture
def client():
    return TestClient(app)
