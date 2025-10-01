#!/usr/bin/env bash
set -euo pipefail
BASE_URL=${BASE_URL:-http://localhost:3000}

echo "Healthcheck:" && curl -s ${BASE_URL}/health | jq . || true

echo "\nСоздаём 2 поста:" && \
  curl -s -X POST "$BASE_URL/posts" \
       -H 'Content-Type: application/json' \
       -d '{"title":"Первый пост","content":"Привет из API"}' | jq . && \
  curl -s -X POST "$BASE_URL/posts" \
       -H 'Content-Type: application/json' \
       -d '{"title":"Второй пост","content":"Ещё один"}' | jq . || true

echo "\nСписок постов:" && curl -s "$BASE_URL/posts" | jq . || true

ID=1
echo "\nПолучаем пост id=$ID:" && curl -s "$BASE_URL/posts/$ID" | jq . || true

echo "\nОбновляем пост id=$ID:" && \
  curl -s -X PUT "$BASE_URL/posts/$ID" \
       -H 'Content-Type: application/json' \
       -d '{"title":"Обновлённый заголовок"}' | jq . || true

# echo "\nУдаляем пост id=$ID:" && curl -s -X DELETE "$BASE_URL/posts/$ID" | jq . || true