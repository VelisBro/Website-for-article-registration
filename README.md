# Site Version 1.1

Локальная версия сайта на Next.js 16, React 19 и Prisma SQLite.

## Быстрый старт

Если проект получен как готовый локальный ZIP-архив, то самый удобный способ запуска:

```powershell
.\start-local.bat
```

Скрипт:

- проверит, что установлен Node.js
- при необходимости установит зависимости
- при необходимости создаст локальную базу
- запустит сайт и откроет `http://localhost:3000`

Для остановки сервера можно закрыть окно с `npm run dev` или запустить:

```powershell
.\stop-local.bat
```

Важно: на компьютере получателя должен быть установлен Node.js 20 или новее.

## Полная настройка с нуля

1. Склонируй репозиторий и открой папку проекта.
2. Установи зависимости:

```powershell
npm install
```

3. Создай локальный файл окружения из примера:

```powershell
Copy-Item .env.example .env.local
```

4. Сгенерируй Prisma Client и подготовь локальную базу:

```powershell
npm run db:generate
npm run db:push
npm run db:seed
```

5. Запусти проект:

```powershell
npm run dev
```

6. Открой в браузере `http://localhost:3000`.

## Полезные команды

```powershell
npm run lint
npm run typecheck
npm run verify
```

## Переменные окружения

Смотри шаблон в `.env.example`.

По умолчанию проект использует локальную SQLite-базу:

```env
DATABASE_URL="file:./prisma/dev.db"
```

## Важно

- Не открывай `html`-файлы напрямую: проект запускается через Next.js.
- Если в PowerShell команда `npm` конфликтует с политикой выполнения, используй `npm.cmd`.
- В dev-режиме используется `next dev --webpack`.
