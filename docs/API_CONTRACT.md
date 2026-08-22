# Harmoniq — API CONTRACT

> **Статус:** актуалізовано 21.08.2026 з урахуванням останнього погодженого canonical API Contract та фактичної структури `develop`.
>
> **Базовий шлях:** `/api`

> **Назви документації:** у всіх посиланнях використовуються канонічні імена файлів без локальних суфіксів копій на кшталт `(1)`, `(2)`, `(3)` або timestamp у назві.

---

## 1. Загальні правила API

### 1.1 Успішна відповідь

Більшість endpoint використовують envelope:

```json
{
  "data": {},
  "message": "Success"
}
```

Feature-specific auth/mutation endpoint можуть мати власний success payload, якщо це вже зафіксовано фактичною реалізацією.

### 1.2 Формат помилки

Канонічний validation/application error:

```json
{
  "status": 400,
  "message": "Validation error",
  "details": []
}
```

Основні статуси:

```text
400 — invalid body/query/params, invalid MongoDB ObjectId
401 — unauthenticated private request
403 — forbidden operation / зміна чужого ресурсу
404 — resource not found
409 — duplicate/conflict, якщо feature contract використовує conflict semantics
4xx — upload/Multer validation error; не 500
```

### 1.3 ID contract

На API-рівні канонічне поле:

```text
id
```

MongoDB/Mongoose може використовувати `_id` внутрішньо, але Frontend API types не повинні змішувати `id` та `_id`.

Для URL params:

```text
userId
articleId
```

потрібен валідний MongoDB ObjectId.

### 1.4 Private endpoints

Усі private endpoint використовують:

```http
Authorization: Bearer <accessToken>
```

`refreshToken` і `sessionId` cookies використовуються session/refresh механізмом, але не замінюють Bearer token для endpoint, захищених `authenticate`.

---

# 2. Auth

## 2.1 Route map

| Method | Route                             | Access                  | Owner |
| ------ | --------------------------------- | ----------------------- | ----- |
| POST   | `/auth/register`                  | Public                  | №2    |
| POST   | `/auth/register?mode=check-email` | Public                  | №2    |
| POST   | `/auth/login`                     | Public                  | №3    |
| POST   | `/auth/session`                   | Refresh/session cookies | №4    |
| DELETE | `/auth/session`                   | Session                 | №4    |

---

## 2.2 Register

```http
POST /api/auth/register
```

Content-Type:

```text
multipart/form-data
```

коли передається avatar.

Канонічні поля:

| Field      | Type   |                           Required | Rules                                                                              |
| ---------- | ------ | ---------------------------------: | ---------------------------------------------------------------------------------- |
| `name`     | string |                                yes | trim/normalize, 2..32, літери, пробіли між словами, дефіс, `'`/`’`; без цифр/emoji |
| `email`    | string |                                yes | valid email, trim, max 64                                                          |
| `password` | string |                                yes | 8..64, без автоматичного trim                                                      |
| `avatar`   | file   | optional у поточному register flow | max 1 MB; JPEG/PNG/WEBP; один файл                                                 |

`POST /api/auth/register?mode=check-email` використовує той самий route у режимі перевірки доступності email.

---

## 2.3 Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

`email` використовує той самий базовий contract, що Register.

---

## 2.4 Session

```http
POST /api/auth/session
DELETE /api/auth/session
```

POST використовує:

```text
refreshToken cookie
sessionId cookie
```

і повертає новий `accessToken` згідно з session flow.

DELETE завершує session та очищає auth cookies.

---

# 3. Users

## 3.1 Current User

| Method | Route       | Access  | Owner |
| ------ | ----------- | ------- | ----- |
| GET    | `/users/me` | Private | №5    |
| PATCH  | `/users/me` | Private | №5    |

### PATCH `/api/users/me`

Підтримувані editable fields:

```text
name
avatar
```

`avatar` передається через `multipart/form-data`.

Потрібно передати щонайменше одне з полів `name` або `avatar`.

`name` використовує той самий validation contract, що Register.

У User API response канонічне поле аватара:

```text
avatarUrl
```

не `avatar`.

Current User response повинен містити `articlesAmount`, якщо це передбачено актуальним Profile contract.

---

## 3.2 Users list / Top Creators

```http
GET /api/users
```

Access: Public  
Owner: №6

Канонічні query parameters:

| Param     | Type    |         Default | Rules                                            |
| --------- | ------- | --------------: | ------------------------------------------------ |
| `page`    | integer |             `1` | `>= 1`                                           |
| `perPage` | integer |            `20` | `1..100`                                         |
| `sort`    | string  | backend default | `articlesAmount`, `createdAt`, `name`, `popular` |

**`limit` НЕ є частиною канонічного контракту `/users`.**

`popular` може нормалізуватися Backend до сортування за `articlesAmount`.

Канонічний Top Creators request:

```http
GET /api/users?page=1&perPage=6&sort=articlesAmount
```

Приклад response:

```json
{
  "data": {
    "items": [
      {
        "id": "USER_ID",
        "name": "User name",
        "avatarUrl": null,
        "articlesAmount": 0
      }
    ],
    "meta": {
      "page": 1,
      "perPage": 6,
      "totalItems": 0,
      "totalPages": 0,
      "hasNextPage": false
    }
  },
  "message": "Success"
}
```

---

## 3.3 User details

```http
GET /api/users/:userId
```

Access: Public  
Owner: №7

`userId` → valid MongoDB ObjectId.

User response використовує:

```text
id
name
avatarUrl
...
```

а не змішані `avatar` / `avatarUrl`.

---

## 3.4 User articles

```http
GET /api/users/:userId/articles
```

Access: Public  
Owner: №8

Query:

| Param     | Default | Rules                       |
| --------- | ------: | --------------------------- |
| `page`    |     `1` | positive integer            |
| `perPage` |     `8` | positive integer, max `100` |

`userId` → valid MongoDB ObjectId.

Pagination залишається частиною response contract.

---

## 3.5 Bookmarks

| Method | Endpoint                         | Access  | Owner |
| ------ | -------------------------------- | ------- | ----- |
| GET    | `/users/me/bookmarks`            | Private | №9    |
| POST   | `/users/me/bookmarks`            | Private | №9    |
| DELETE | `/users/me/bookmarks/:articleId` | Private | №9    |

GET query:

```text
page=1
perPage=12
```

`perPage` max:

```text
100
```

POST body:

```json
{
  "articleId": "ARTICLE_ID"
}
```

`articleId` → required valid MongoDB ObjectId.

Канонічний DELETE:

```http
DELETE /api/users/me/bookmarks/:articleId
```

**Не передавати `articleId` у DELETE body.**

---

# 4. Articles

## 4.1 Articles List

```http
GET /api/articles
```

Access: Public  
Owner: №11

Поточний погоджений contract:

| Param       | Default | Rules                                                             |
| ----------- | ------: | ----------------------------------------------------------------- |
| `page`      |     `1` | positive integer                                                  |
| `perPage`   |     `8` | positive integer                                                  |
| `filter`    |   `all` | `all` / `popular`                                                 |
| `authorId`  |       — | valid ObjectId when provided                                      |
| `excludeId` |       — | valid ObjectId when provided                                      |
| `limit`     |       — | positive integer; підтримується поточною article-list реалізацією |

Рішення прибрати `limit` стосується `/users`, **не `/articles`**.

Invalid explicit query values повинні повертати:

```text
400
```

а не тихо виправлятися до default.

Поточна pagination metadata:

```json
{
  "page": 1,
  "perPage": 8,
  "totalItems": 0,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPreviousPage": false
}
```

`popular` — поведінка filter/sort. Клієнт не встановлює `category = popular`.

---

## 4.2 Article Details

```http
GET /api/articles/:articleId
```

Access: Public з optional authentication context  
Owner: №10

`articleId` → valid MongoDB ObjectId.

Expected response areas:

```text
article
author
isBookmarked
recommendations
```

Optional auth використовується для user-specific state, наприклад bookmark status.

Invalid `articleId` → `400`.  
Article not found → `404`.

---

## 4.3 Create Article

```http
POST /api/articles
```

Access: Private  
Owner: №13

Middleware flow:

```text
authenticate
articleUpload.single("image")
validateCreateArticle
```

Content-Type:

```text
multipart/form-data
```

### Канонічні client-editable fields

| Field             | Type   | Required | Rules                              |
| ----------------- | ------ | -------: | ---------------------------------- |
| `title`           | string |      yes | trim, 3..48                        |
| `article`         | string |      yes | trim, 100..4000                    |
| `publicationDate` | string |      yes | `YYYY-MM-DD`                       |
| `image`           | file   |      yes | max 1 MB; JPEG/PNG/WEBP; один файл |

Canonical FormData:

```text
title
article
publicationDate
image
```

### Не приймати від client

```text
id
_id
authorId
description
viewsCount
category
imageUrl
imagePublicId
```

Правила:

- author береться з authenticated user, а не з body;
- `description` генерується Backend із `article`;
- `category` не є client-editable Create field;
- `viewsCount` не встановлюється клієнтом;
- upload/Multer validation error → контрольований `4xx`, не `500`.

---

## 4.4 Article Management

| Method | Endpoint               | Access  | Owner |
| ------ | ---------------------- | ------- | ----- |
| PATCH  | `/articles/:articleId` | Private | №12   |
| DELETE | `/articles/:articleId` | Private | №12   |

`articleId` → valid MongoDB ObjectId.

Змінювати або видаляти статтю може лише її owner. Інакше:

```text
403
```

### PATCH editable fields

| Field             | Required | Rules                              |
| ----------------- | -------: | ---------------------------------- |
| `title`           |       no | якщо передано — trim, 3..48        |
| `article`         |       no | якщо передано — trim, 100..4000    |
| `publicationDate` |       no | якщо передано — `YYYY-MM-DD`       |
| `image`           |       no | max 1 MB; JPEG/PNG/WEBP; один файл |

Потрібно передати щонайменше одне editable field або image.

PATCH **не приймає** як client-editable:

```text
description
category
authorId
viewsCount
```

Якщо змінюється `article`, Backend повинен заново сформувати `description`.

---

# 5. Health

```http
GET /api/health
```

Owner: Team Lead / shared infrastructure.

У поточну канонічну implemented route map не включаємо `/api/categories` та `/api-docs`, якщо їх немає у фактичному `backend/src/routes/index.js`.

---

# 6. Pagination Contract

Для paginated endpoint канонічні назви:

```text
page
perPage
```

Спільна metadata:

```text
page
perPage
totalItems
totalPages
hasNextPage
```

`hasPreviousPage` додатково повертається там, де це реалізовано поточним feature contract.

Окремо:

```text
/users     → page, perPage, sort; без limit
/articles  → page, perPage, filter, authorId, excludeId; limit наразі підтримується
```

---

# 7. Validation / Frontend ↔ Backend

Для кожного endpoint Frontend і Backend повинні мати однакові:

```text
field names
types
required / optional
min / max
regex / format
normalization
enum
URL params
query params
body / multipart fields
auth mechanism
response structure
error structure
```

Frontend Yup/schema повинна дзеркалити Backend validation для UX.

Backend є runtime source of truth, але якщо Backend суперечить погодженому contract/ТЗ — правило не змінюється одноосібно: owner виносить питання Team Lead.

---

# 8. Ownership API Map

```text
POST   /api/auth/register                         — №2
POST   /api/auth/register?mode=check-email        — №2
POST   /api/auth/login                            — №3
POST   /api/auth/session                          — №4
DELETE /api/auth/session                          — №4

GET    /api/users/me                              — №5
PATCH  /api/users/me                              — №5
GET    /api/users                                 — №6
GET    /api/users/:userId                         — №7
GET    /api/users/:userId/articles                — №8

GET    /api/users/me/bookmarks                    — №9
POST   /api/users/me/bookmarks                    — №9
DELETE /api/users/me/bookmarks/:articleId         — №9

GET    /api/articles/:articleId                   — №10
GET    /api/articles                              — №11
PATCH  /api/articles/:articleId                   — №12
DELETE /api/articles/:articleId                   — №12
POST   /api/articles                              — №13

GET    /api/health                                — Team Lead/shared
```

---

# 9. Правило зміни контракту

Перед зміною route, query parameter, body field, response field, validation rule або status code:

1. Перевірити цей API Contract.
2. Перевірити фактичний `develop`.
3. Якщо є суперечність — погодити рішення з Team Lead **до реалізації**.
4. Після погодження синхронно оновити:
   - Backend;
   - Frontend;
   - shared types;
   - QA cases;
   - Swagger/API docs;
   - цей документ.
5. Не додавати aliases або дублікати query/body fields тільки заради сумісності із застарілою документацією.

---

# 10. Definition of Done для API Contract

Перед фінальним PR:

- [ ] Endpoint і HTTP method збігаються Frontend ↔ Backend.
- [ ] Params мають canonical names.
- [ ] ObjectId validation є там, де потрібна.
- [ ] Query ranges/enums збігаються.
- [ ] Body/FormData field names збігаються.
- [ ] `required/optional` збігаються.
- [ ] `min/max` збігаються.
- [ ] Date formats збігаються.
- [ ] Upload MIME/file-size rules збігаються.
- [ ] Bearer auth використовується для private endpoint.
- [ ] Response відповідає shared types.
- [ ] `id/_id` не змішуються.
- [ ] `avatarUrl` використовується як canonical User response field.
- [ ] Validation/Multer errors не перетворюються на `500`.
- [ ] Swagger/API docs оновлено.
- [ ] `npm run lint` пройдений.
- [ ] `npm run build` пройдений.
- [ ] QA positive cases пройдені.
- [ ] QA negative cases пройдені.

---

## Фінальне правило

> **One entity — one contract.**
>
> Create/Register визначає constraints полів; PATCH робить дозволені поля optional, але не послаблює їх validation. Backend є authoritative runtime validation, Frontend дзеркалить той самий contract для UX.
