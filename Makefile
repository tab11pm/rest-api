# Быстрые команды для сборки/запуска

.PHONY: build up down logs ps sh api-logs db-logs curl-demo

build:
	docker compose build

up:
	docker compose up -d

logs:
	docker compose logs -f --tail=100

api-logs:
	docker compose logs -f api

db-logs:
	docker compose logs -f db

ps:
	docker compose ps

down:
	docker compose down

sh:
	docker compose exec api sh

curl-demo:
	sh ./requests.sh