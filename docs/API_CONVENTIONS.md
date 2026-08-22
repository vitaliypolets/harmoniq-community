# API_CONVENTIONS.md

> **Назви документації:** у всіх посиланнях використовуються канонічні імена файлів без локальних суфіксів копій на кшталт `(1)`, `(2)`, `(3)` або timestamp у назві.
# API Conventions

Цей документ визначає єдині правила роботи з HTTP-запитами та API у проєкті **Harmoniq**.

У проєкті використовується така схема:

```text
Frontend
   ↓
Next.js Route Handlers
   ↓
Express Backend
   ↓
MongoDB
```

Next.js Route Handlers працюють як proxy/BFF між frontend і окремим Express Backend.

Базовий шлях Express Backend:

```text
/api
```

---

## HTTP Methods

| Метод    | Призначення                            |
| -------- | -------------------------------------- |
| `GET`    | Отримання даних                        |
| `POST`   | Створення нового ресурсу / action      |
| `PATCH`  | Часткове оновлення ресурсу             |
| `DELETE` | Видалення ресурсу / завершення session |

`PUT` не використовуємо, доки він явно не з'явиться у погодженому API Contract.

---

## HTTP Status Codes

| Код   | Використання                                                              |
| ----- | ------------------------------------------------------------------------- |
| `200` | Успішний GET/PATCH або endpoint, контракт якого повертає body             |
| `201` | Ресурс успішно створено                                                   |
| `204` | Успішна операція без response body, якщо це зафіксовано endpoint contract |
| `400` | Invalid body/query/params, invalid ObjectId, validation/upload error      |
| `401` | Користувач не автентифікований / access token недійсний                   |
| `403` | Користувач автентифікований, але не має права на операцію                 |
| `404` | Ресурс або endpoint не знайдено                                           |
| `409` | Duplicate/conflict, якщо feature contract використовує conflict semantics |
| `500` | Неочікувана внутрішня помилка сервера                                     |

Validation та Multer/upload errors **не повинні перетворюватися на `500`**.

---

## Формат успішної відповіді

Базовий envelope:

```json
{
  "data": {},
  "message": "Success"
}
```

Feature-specific auth/mutation endpoint може мати власний success payload, якщо це вже зафіксовано актуальним контрактом.

Для paginated list:

```json
{
  "data": {
    "items": [],
    "meta": {
      "page": 1,
      "perPage": 8,
      "totalItems": 0,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  },
  "message": "Success"
}
```

Не створювати іншу pagination structure у новій feature без погодження.

---

## Формат помилки

Канонічний application/validation error:

```json
{
  "status": 400,
  "message": "Validation error",
  "details": []
}
```

Конкретний endpoint може мати конкретніше `message`, але Frontend не повинен залежати від випадкової форми Express/Multer error.

---

## `id` vs `_id`

Канонічне поле API:

```text
id
```

MongoDB/Mongoose може використовувати:

```text
_id
```

внутрішньо.

Frontend API types не повинні змішувати `id` та `_id`.

URL params використовують:

```text
userId
articleId
```

і повинні проходити MongoDB ObjectId validation.

Не допускаються:

```text
undefined
null
[object Object]
```

---

## User avatar naming

Канонічне поле User API response:

```text
avatarUrl
```

Не використовуємо одночасно:

```text
avatar
avatarUrl
```

`avatar` допускається як multipart request field для upload, але response field — `avatarUrl`.

---

## Authorization

Private endpoint використовують:

```http
Authorization: Bearer <accessToken>
```

`refreshToken` та `sessionId` cookies використовуються session/refresh механізмом, але не замінюють Bearer access token для endpoint, захищених `authenticate`.

Frontend private requests повинні використовувати shared API client, а не дублювати auth logic у кожній feature.

---

## Правила для Route Handlers

Next.js Route Handlers працюють як proxy/BFF і **не дублюють бізнес-логіку Express Backend**.

Route Handler повинен:

- отримати request від frontend;
- передати body/FormData, query params та необхідні headers;
- за потреби передати auth/cookie context;
- викликати Express Backend;
- зберегти backend HTTP status;
- повернути frontend фактичний backend response;
- коректно передати контрольовану backend error response.

Route Handler не повинен:

- вигадувати інші validation constraints;
- перейменовувати поля без canonical contract;
- перетворювати `4xx` Backend на `500`;
- реалізовувати domain/business logic Backend.

---

## Правила для Express Backend

Express Backend відповідає за:

- бізнес-логіку;
- authentication/authorization;
- runtime validation;
- MongoDB/Mongoose;
- ownership/permission checks;
- HTTP status codes;
- API response;
- upload validation;
- server-derived fields.

Backend є runtime source of truth, але зміна, що суперечить погодженому контракту/ТЗ, не вноситься одноосібно.

---

## Pagination conventions

Основні назви:

```text
page
perPage
```

Invalid explicit query values → `400`, а не silent correction.

### Users

```http
GET /api/users
```

Канонічні query:

```text
page
perPage
sort
```

`limit` **не є** частиною canonical `/users` contract.

Top Creators:

```http
GET /api/users?page=1&perPage=6&sort=articlesAmount
```

### Articles

```http
GET /api/articles
```

Поточний contract підтримує:

```text
page
perPage
filter
authorId
excludeId
limit
```

Рішення прибрати `limit` з `/users` не означає автоматично прибрати його з `/articles`.

---

## Bookmarks convention

Endpoints:

```http
GET    /api/users/me/bookmarks
POST   /api/users/me/bookmarks
DELETE /api/users/me/bookmarks/:articleId
```

POST body:

```json
{
  "articleId": "ARTICLE_ID"
}
```

DELETE використовує URL param:

```text
:articleId
```

`articleId` **не передається в DELETE body**.

---

## Create Article convention

```http
POST /api/articles
```

Private:

```http
Authorization: Bearer <accessToken>
```

Content-Type:

```text
multipart/form-data
```

Canonical FormData:

```text
title             required, trim, 3..48
article           required, trim, 100..4000
publicationDate   required, YYYY-MM-DD
image             required, JPEG/PNG/WEBP, max 1 MB, one file
```

Клієнт не передає:

```text
id
_id
authorId
description
category
viewsCount
imageUrl
imagePublicId
```

`authorId` визначається з authenticated user.

`description` — server-derived field, який Backend формує з `article`.

`category` не є client-editable Create field.

Upload/Multer validation error → контрольований `4xx`.

---

## PATCH Article convention

```http
PATCH /api/articles/:articleId
```

Client-editable:

```text
title
article
publicationDate
image
```

Поля optional, але потрібно передати щонайменше одне поле або image.

Якщо поле передано, constraints ті самі, що Create:

```text
title: 3..48
article: 100..4000
publicationDate: YYYY-MM-DD
image: JPEG/PNG/WEBP, max 1 MB
```

Не приймати від client:

```text
description
category
authorId
viewsCount
```

Якщо змінюється `article`, Backend повторно генерує `description`.

Змінювати/видаляти статтю може лише owner; інакше `403`.

---

## Auth conventions

Основні endpoint:

```http
POST   /api/auth/register
POST   /api/auth/register?mode=check-email
POST   /api/auth/login
POST   /api/auth/session
DELETE /api/auth/session
```

Register:

```text
name: 2..32
email: valid email, max 64
password: 8..64
avatar: multipart file when supplied, max 1 MB, JPEG/PNG/WEBP
```

Неправильний login → `401`.

Duplicate/conflict при реєстрації → відповідний погоджений conflict status (`409`, якщо саме так реалізовано feature contract).

---

## API Contract

Перед інтеграцією Frontend і Backend обов'язково звіряються:

- HTTP method;
- endpoint;
- URL params;
- query params;
- body/FormData;
- field names;
- types;
- required/optional;
- min/max;
- enum/format;
- auth mechanism;
- response structure;
- HTTP status codes;
- error structure.

Приклад:

```text
GET /api/articles/:articleId

Params:
articleId = valid MongoDB ObjectId

Success:
200

Errors:
400 invalid articleId
404 article not found
500 only unexpected server error
```

---

## API Ownership

| Owner     | API                                                                       |
| --------- | ------------------------------------------------------------------------- |
| №2        | Register / check-email                                                    |
| №3        | Login / auth state                                                        |
| №4        | Session integration                                                       |
| №5        | Current User / Profile Edit                                               |
| №6        | Users List / Top Creators                                                 |
| №7        | User Details / Authors                                                    |
| №8        | User Articles / Profile                                                   |
| №9        | Bookmarks                                                                 |
| №10       | Article Details                                                           |
| №11       | Articles List                                                             |
| №12       | Article PATCH/DELETE                                                      |
| №13       | Create Article                                                            |
| Team Lead | shared API/auth/validation infrastructure, `/api/health`, contract freeze |

Owner не змінює shared infrastructure або файл іншого owner без координації з Team Lead.

---

## Зміна API Contract

Погоджений API Contract не змінюється одноосібно.

Порядок:

1. Перевірити `API_CONTRACT.md`.
3. Звірити з фактичним `develop`.
4. Якщо є розбіжність — owner повідомляє Team Lead:
   - Frontend зараз;
   - Backend зараз;
   - запропонований canonical rule.
5. Після погодження синхронно оновлюються:
   - Backend;
   - Frontend;
   - shared types;
   - QA cases;
   - Swagger/API docs;
   - документація.
6. Не додавати aliases або дублікати параметрів лише для підтримки застарілого документа.

---

## Checklist перед PR

- [ ] HTTP method і endpoint збігаються FE ↔ BE.
- [ ] Params мають canonical names.
- [ ] ObjectId validation є.
- [ ] Query params мають однакові ranges/enums.
- [ ] Body/FormData names збігаються.
- [ ] `required/optional` збігаються.
- [ ] `min/max` збігаються.
- [ ] Date formats збігаються.
- [ ] Upload MIME/file-size rules збігаються.
- [ ] Private endpoint має Bearer auth.
- [ ] Response type відповідає фактичному response.
- [ ] `id/_id` не змішуються.
- [ ] User response використовує `avatarUrl`.
- [ ] Error response обробляється Frontend.
- [ ] Validation/Multer errors не стають `500`.
- [ ] `npm run lint` пройдений.
- [ ] `npm run build` пройдений.
- [ ] QA positive/negative cases пройдені.

---

## Головне правило

Frontend, Next.js Route Handlers і Express Backend використовують **один погоджений API Contract**.

> **One entity — one contract.**

Create/Register визначає constraints полів. PATCH робить дозволені поля optional, але не послаблює validation constraints.

Назви полів, status codes, validation та response structure не змінюються без погодження Team Lead.
