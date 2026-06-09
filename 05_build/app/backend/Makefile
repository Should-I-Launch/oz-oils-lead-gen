.PHONY: test lint dev install

install:
	pip install -r requirements-dev.txt

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	pytest -v

lint:
	python -m py_compile app/main.py
