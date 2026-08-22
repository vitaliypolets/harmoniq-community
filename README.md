# Harmoniq

## Про проєкт

**Harmoniq** — командний Fullstack-проєкт, який виконується в межах навчальної програми GoIT.

Мета команди — реалізувати проєкт відповідно до технічного завдання, дотримуючись єдиного процесу розробки, стандартів коду та правил командної взаємодії.

---

## Посилання

### GitHub

https://github.com/vitaliypolets/project-webcrafters-03.git

### Демо проєкту

https://project-webcrafters-03-frontend.vercel.app

## Технологічний стек

| Категорія          | Технології                                                        |
| ------------------ | ----------------------------------------------------------------- |
| Frontend           | HTML5, CSS3, TypeScript, React, Next.js (App Router), CSS Modules |
| Frontend API Layer | Next.js Route Handlers (proxy/BFF до Express Backend)             |
| Backend            | Node.js, Express, JavaScript                                      |
| База даних         | MongoDB, Mongoose                                                 |
| Робота з API       | REST API, Axios, TanStack Query                                   |
| Авторизація        | JWT, Bcrypt                                                       |
| Форми              | Formik                                                            |
| Валідація          | Yup                                                               |
| Global State       | Zustand                                                           |
| Повідомлення       | react-hot-toast                                                   |
| Upload             | Multer, Cloudinary                                                |
| Інструменти        | Git, GitHub, npm, ESLint, Prettier, VS Code                       |
| Дизайн             | Figma                                                             |
| Деплой             | Vercel / Render                                                   |

### Правила використання

- Axios використовується у frontend service/API layer для запитів до `/api/...`.
- TanStack Query використовується для server state, кешування та мутацій.
- Next.js Route Handlers використовують `fetch` / `proxyToBackend` для проксіювання запитів до Express Backend.
- Formik + Yup використовуються для форм та їх валідації.
- Zustand використовується для глобального client state.
- react-hot-toast використовується для toast-повідомлень.
- `alert()` для повідомлень користувачу не використовується.
- Multer + Cloudinary використовуються для завантаження зображень.

---

## Архітектура

Проєкт організований як monorepo та складається з двох основних частин:

- frontend/ — Next.js застосунок на базі App Router;
- backend/ — окремий REST API на Node.js та Express.

Next.js Route Handlers розміщуються у frontend-частині та використовуються як proxy/BFF між клієнтською частиною застосунку та Express Backend.

Express Backend відповідає за бізнес-логіку, авторизацію, роботу з даними та взаємодію з MongoDB через Mongoose.

## Основні принципи

- Використовується сучасний стек технологій для розробки Fullstack-застосунку.
- Frontend реалізований на Next.js (App Router), а Backend — як окремий REST API на Node.js + Express.
- Взаємодія між клієнтом і сервером здійснюється через REST API.
- Контроль версій здійснюється за допомогою Git та GitHub.
- Для забезпечення єдиного стилю коду використовуються ESLint і Prettier.

---

## Документація

Перед початком роботи кожен учасник команди повинен ознайомитися з актуальними документами. Канонічні назви файлів:

| Документ | Призначення |
| --- | --- |
| `README.md` | Загальна інформація про проєкт та навігація по документації |
| `TEAM_RULES.md` | Правила роботи команди |
| `GIT_WORKFLOW.md` | Git, Pull Request та production workflow |
| `OWNERSHIP_MAP.md` | Канонічні ownership-зони та структура проєкту |
| `API_CONTRACT.md` | Канонічні REST API endpoints, request/response contracts |
| `API_CONVENTIONS.md` | Спільні HTTP/API conventions |
| `DATABASE_ARTICLE_CONTRACT.md` | MongoDB/Mongoose Article contract і міграція legacy data |
| `FRONTEND_LAYOUT_GUIDE.md` | Shared UI, layout, responsive та frontend integration rules |
| `TL_MASTER_LIST.md` | Централізований TL/shared-core стан проєкту |

---

## Початок роботи

1. Ознайомитися з документацією.
3. Створити власну feature-гілку.
4. Розпочати виконання своєї задачі.

---

## Комунікація

Основний канал комунікації команди — **Slack**.
Резервний канал комунікації команди — **Telegram**.
У разі виникнення питань щодо реалізації, архітектури або організації роботи необхідно звернутися до Team Lead або обговорити питання в командному чаті.

---

## Канонічний API та validation contract

Базовий шлях Express Backend:

```text
/api
```

Канонічні правила:

- API response використовує `id`; MongoDB `_id` залишається внутрішнім полем.
- Для User API response використовується `avatarUrl`, а не змішані `avatar` / `avatarUrl`.
- Невалідний MongoDB ObjectId повертає `400`.
- Неавторизований private request повертає `401`.
- Спроба змінити або видалити чужий ресурс повертає `403`.
- Відсутній ресурс повертає `404`.
- Upload/Multer validation errors повинні повертати контрольований `4xx`, а не `500`.
- Private endpoint використовують Bearer access token через shared API client.
- Frontend validation повинна відповідати Backend validation.

### Pagination

Канонічні назви:

```text
page
perPage
```

Для:

```text
GET /api/users
```

використовуються:

```text
page
perPage
sort
```

`limit` не є частиною канонічного `/users` contract.

Top Creators:

```http
GET /api/users?page=1&perPage=6&sort=articlesAmount
```

Для:

```text
GET /api/articles
```

поточна реалізація додатково підтримує `filter`, `authorId`, `excludeId` та `limit`.

### Bookmarks

Канонічне видалення закладки:

```http
DELETE /api/users/me/bookmarks/:articleId
```

`articleId` не передається у DELETE body.

### Create Article

Канонічний `multipart/form-data`:

```text
title             required, 3..48
article           required, 100..4000
publicationDate   required, YYYY-MM-DD
image             required, JPEG/PNG/WEBP, max 1 MB
```

Клієнт не передає:

```text
authorId
description
category
viewsCount
imageUrl
imagePublicId
```

Автор визначається з authenticated user.

`description` формується Backend із `article`.

### PATCH Article

Client-editable fields:

```text
title
article
publicationDate
image
```

Усі поля optional, але потрібно передати щонайменше одне поле або image.

Якщо передано поле, воно використовує ті самі validation constraints, що й Create Article.

---

## API Ownership

| Owner              | Endpoint                                                                        |
| ------------------ | ------------------------------------------------------------------------------- |
| №2                 | `POST /api/auth/register`, check-email mode                                     |
| №3                 | `POST /api/auth/login`                                                          |
| №4                 | `POST/DELETE /api/auth/session`                                                 |
| №5                 | `GET/PATCH /api/users/me`                                                       |
| №6                 | `GET /api/users`                                                                |
| №7                 | `GET /api/users/:userId`                                                        |
| №8                 | `GET /api/users/:userId/articles`                                               |
| №9                 | `GET/POST /api/users/me/bookmarks`, `DELETE /api/users/me/bookmarks/:articleId` |
| №10                | `GET /api/articles/:articleId`                                                  |
| №11                | `GET /api/articles`                                                             |
| №12                | `PATCH/DELETE /api/articles/:articleId`                                         |
| №13                | `POST /api/articles`                                                            |
| Team Lead / shared | `GET /api/health`, shared API/auth/validation infrastructure                    |

---

## Правило зміни контракту

Під час stabilization не можна одноосібно змінювати route, query parameter, body/FormData field, response field, validation rule або status code.

Порядок:

2. Звірити правило з фактичним `develop`.
3. Розбіжність погодити з Team Lead до реалізації.
4. Після погодження синхронно оновити Backend, Frontend, shared types, QA cases та документацію.
5. Не додавати aliases або дублікати параметрів лише для сумісності із застарілою документацією.

---

## Актуальність документації

Документація є частиною проєкту.

У разі зміни процесів розробки або архітектури відповідні документи будуть оновлятися.
