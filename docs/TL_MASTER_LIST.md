# Harmoniq --- TL Master List

## Централізовано реалізовано та поточний стан проєкту

Цей документ фіксує shared/core зміни, які вже централізовано
реалізовані Team Lead, правила для учасників та блоки, які ще
залишаються в роботі.

## 1. Структура monorepo

``` text
project-webcrafters-03/
├── frontend/
├── backend/
├── docs/
├── package.json
└── ...
```

Frontend і backend знаходяться в одному repository, але мають окремі
залежності та зони відповідальності.

## 2. Централізована структура Frontend

``` text
frontend/src/
├── app/
├── components/
├── lib/
├── services/
├── store/
├── types/
└── ...
```

Учасники не створюють альтернативну глобальну структуру без узгодження з
TL.

## 3. Централізована структура Backend

``` text
backend/src/
├── config/
├── middlewares/
├── models/
├── modules/
├── routes/
├── utils/
└── ...
```

Feature-модулі організовані за зонами `auth`, `articles`, `users`.

## 4. Backend переведено з TypeScript на JavaScript

Backend feature-файли централізовано переведені з `.ts` на `.js`, щоб
команда використовувала один узгоджений стек.

## 5. Express bootstrap

Централізовано підключені `pinoHttp`, `cors`, `express.json`,
`cookieParser`, `apiRouter`, `notFound`, `errorHandler`.
Feature-учасники не створюють власний Express bootstrap.

## 6. Центральний API Router

API будується від `/api`: `/api/auth/...`, `/api/articles/...`,
`/api/users/...`. Feature routers підключаються через центральний
routing layer.

## 7. Shared backend middleware

Закладені спільні `controllerWrapper`, `errorHandler`, `notFound`.
Controllers не повинні дублювати глобальний механізм обробки помилок.

## 8. MongoDB / Mongoose infrastructure

Є централізовані `User.js` та `Session.js`. User містить `name`,
`email`, `passwordHash`, `avatarUrl`, `avatarPublicId`, `savedArticles`,
`articlesAmount`.

`passwordHash` має `select: false`, тому Login використовує:

``` js
User.findOne({ email }).select('+passwordHash');
```

## 9. Session model

Session використовує:

``` text
userId
refreshTokenHash
expiresAt
```

Raw refresh token у MongoDB не зберігається.

## 10. Централізований Axios

Закладена спільна Axios infrastructure. Учасники не створюють окремі
`axios.create()` зі своїми правилами. Це важливо для auth cookies та
єдиної поведінки API-запитів.

## 11. TanStack React Query Provider

Централізовано налаштований `QueryClientProvider` через `AppProviders`:

``` tsx
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});
```

## 12. Global AppProviders

Єдина точка providers містить `QueryClientProvider`, `Toaster` та
`children`.

## 13. Global Toaster

`react-hot-toast` винесений глобально:

``` tsx
<Toaster
  position="top-right"
  toastOptions={{ duration: 4000 }}
/>
```

Feature-код використовує `toast.success()` / `toast.error()`, не додаючи
власний `<Toaster />`.

## 14. Shared UI / Layout infrastructure

Закладені загальні layout/providers/shared UI механізми. Альтернативні
глобальні providers/layout без узгодження не створюються.

## 15. Zustand auth.store

Базовий auth state:

``` ts
user: User | null;
accessToken: string | null;
isAuthenticated: boolean;
isRefreshing: boolean;
```

Actions: `setSession()`, `clearSession()`, `setRefreshing()`.

## 16. Централізована генерація JWT

Створено:

``` text
backend/src/modules/auth/shared/authTokens.js
```

Shared API:

``` js
createAccessToken(user);
createRefreshToken(user);
```

## 17. Access Token contract

``` text
payload: { userId, email }
TTL: 15m
secret: ACCESS_TOKEN_SECRET
```

## 18. Refresh Token contract

``` text
payload: { userId }
TTL: 30d
secret: REFRESH_TOKEN_SECRET
```

## 19. Централізоване створення Session

Створено:

``` text
backend/src/modules/auth/shared/authSession.js
```

Shared API:

``` js
createAuthSession(userId, refreshToken);
```

## 20. Що робить createAuthSession()

Функція робить `bcrypt.hash(refreshToken, 10)`, формує
`refreshTokenHash`, задає `expiresAt` на 30 днів і виконує:

``` js
Session.create({
  userId,
  refreshTokenHash,
  expiresAt,
});
```

## 21. session.service.js переведений на shared auth

JWT:

``` js
const newAccessToken = createAccessToken(user);
const newRefreshToken = createRefreshToken(user);
```

Session:

``` js
const newSession = await createAuthSession(user._id, newRefreshToken);
```

## 22. Session validation збережена

`bcrypt.compare(refreshToken, session.refreshTokenHash)` залишається в
Session service. У shared винесена саме повторювана логіка створення.

## 23. Session rotation

``` text
refreshToken cookie + sessionId cookie
↓
Session lookup
↓
bcrypt.compare()
↓
User lookup
↓
delete old Session
↓
createAccessToken() + createRefreshToken()
↓
createAuthSession()
↓
new refreshToken + new sessionId + new accessToken
```

## 24. Cookies contract

``` text
refreshToken → httpOnly cookie
sessionId → httpOnly cookie
```

Параметри: `httpOnly: true`, `secure` у production, `sameSite: strict`,
expiration 30 днів.

## 25. Access token не зберігається в cookie

Backend повертає access token у JSON, frontend тримає його в
`auth.store`. Refresh token та sessionId передаються через httpOnly
cookies.

## 26. Login contract

``` text
email + password
↓
User.findOne({ email }).select('+passwordHash')
↓
bcrypt.compare()
↓
createAccessToken()
createRefreshToken()
↓
createAuthSession()
↓
cookies + JSON response
```

## 27. Login response contract

``` json
{
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "User Name",
      "email": "user@example.com",
      "avatarUrl": null,
      "articlesAmount": 0
    },
    "accessToken": "JWT_ACCESS_TOKEN"
  },
  "message": "Successfully logged in!"
}
```

## 28. Що Login не повертає

Не повертаються `passwordHash`, `avatarPublicId`, `refreshToken`,
`sessionId`.

## 29. Що Login не реалізує повторно

Не дублюємо `jwt.sign()`, `bcrypt.hash(refreshToken)`,
`Session.create()`. Використовуємо `createAccessToken()`,
`createRefreshToken()`, `createAuthSession()`.

## 30. Session contract

Refresh endpoint отримує `refreshToken` та `sessionId` із cookies і
повертає:

``` json
{
  "data": {
    "accessToken": "NEW_ACCESS_TOKEN"
  },
  "message": "Successfully refreshed a session!"
}
```

## 31. Logout contract

За `sessionId` видаляється Session та очищаються `refreshToken` і
`sessionId`. Access token cookie не є частиною узгодженої архітектури.

## 32. Register має використовувати shared auth

Register також не повинен дублювати JWT generation, refresh-token
hashing або `Session.create()`.

``` text
Register ─┐
Login ────┼── authTokens.js + authSession.js
Session ──┘
```

## 33. Shared auth --- TL-owned

`backend/src/modules/auth/shared/` є shared/TL infrastructure. Учасники
використовують готовий API, але не змінюють контракт без узгодження.

## 34. Синхронізація feature-гілок з develop

``` bash
git fetch origin
git rebase origin/develop
```

Якщо є незакомічені зміни --- спочатку WIP commit або `git stash`.

## 35. Git workflow

``` text
feature/fix/chore branch → PR → Review → develop
```

TL shared changes:

``` text
chore/project-setup → PR → develop
```

## 36. Роль main

`develop` є integration branch під час активної розробки. `main`
використовується для стабільної production/релізної версії.

Фінальний release flow:

```text
feature/fix/chore → develop → PR develop → main → production deployment → smoke-test
```

Прямий feature → `main` merge не використовується.

## 37. TL документація

Канонічні назви документації:

```text
README.md
TEAM_RULES.md
GIT_WORKFLOW.md
OWNERSHIP_MAP.md
API_CONTRACT.md
API_CONVENTIONS.md
DATABASE_ARTICLE_CONTRACT.md
FRONTEND_LAYOUT_GUIDE.md
TL_MASTER_LIST.md
```

У документації використовуються тільки наведені вище канонічні назви без додаткових префіксів, timestamp або локальних суфіксів копій.

## 38. Ownership

Кожен учасник працює у своїй feature-зоні, а shared/core infrastructure
контролюється TL. До shared/core належать Axios, Providers, Toaster,
authTokens, authSession, global layout, shared UI, `auth.store.ts`,
providers, shared Route Handler/API infrastructure та canonical API contracts.

## 39. Review / PR workflow

`Review / PR` означає:

``` text
feature завершена
↓
PR
↓
TL review
↓
lint/build
↓
Approve
↓
Merge у develop
```

## 40. TL checklist для PR

``` text
✓ тільки файли ownership учасника
✓ немає випадкових shared/core змін
✓ ТЗ виконане
✓ imports/exports коректні
✓ немає дублювання shared logic
✓ немає невирішених конфліктів
✓ API_CONTRACT / VALIDATION_CONTRACT звірені
✓ id / _id не змішуються у frontend API types
✓ User API використовує avatarUrl
✓ validation/Multer 4xx не перетворюються на 500
✓ lint PASS
✓ build PASS
```

## 41. Session / Current User — актуальний стан

Блокери раннього етапу щодо Session restore, `GET /api/users/me` та Profile integration більше не повинні описуватися як майбутня архітектура.

Канонічний auth flow:

```text
Login/Register
↓
accessToken → auth.store
refreshToken + sessionId → httpOnly cookies
↓
Session restore
↓
new accessToken
↓
GET /api/users/me
↓
current User
↓
private UI / profile
```

Private API requests використовують:

```http
Authorization: Bearer <accessToken>
```

---

## 42. Current User contract

Основні endpoint:

```http
GET   /api/users/me
PATCH /api/users/me
```

Канонічне User API поле аватара:

```text
avatarUrl
```

Public API identifier:

```text
id
```

MongoDB `_id` залишається внутрішнім Backend/Mongoose полем.

---

## 43. Users / Top Creators contract

Канонічний Top Creators request:

```http
GET /api/users?page=1&perPage=6&sort=articlesAmount
```

Для `/users` використовуються:

```text
page
perPage
sort
```

`limit` не є частиною canonical `/users` contract.

---

## 44. Bookmarks contract

```http
GET    /api/users/me/bookmarks
POST   /api/users/me/bookmarks
DELETE /api/users/me/bookmarks/:articleId
```

Для DELETE `articleId` передається в URL param, не в body.

---

## 45. Article contract — Create/PATCH

Create:

```http
POST /api/articles
```

Canonical `multipart/form-data`:

```text
title             required, trim, 3..48
article           required, trim, 100..4000
publicationDate   required, YYYY-MM-DD
image             required, JPEG/PNG/WEBP, max 1 MB
```

Client не передає:

```text
authorId
description
category
viewsCount
imageUrl
imagePublicId
```

Backend визначає автора з authenticated user та генерує `description` із `article`.

PATCH:

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

Поля optional, але потрібно передати щонайменше одне поле або image. Якщо змінено `article`, Backend повторно формує `description`.

Upload/Multer validation errors → контрольований `4xx`, а не `500`.

---

## 46. Database — актуальний очищений стан

Після backup, очищення та повторного завантаження canonical seed data:

```text
Users: 81
Articles: 200
Sessions: 0
Broken Article → User references: 0
```

Legacy authors залишаються авторами seed-статей. Для презентації/auth flow створюються окремі нормальні користувачі через актуальний Register contract.

Критичний зв'язок:

```text
Article.authorId → User._id
```

Backup БД, dumps, `.env`, credentials та локальні PR JSON exports не комітяться у Git.

---

## 47. Що централізовано готове / зафіксоване

```text
✅ monorepo frontend/backend
✅ backend JavaScript ES Modules
✅ Express bootstrap та central API router
✅ MongoDB/Mongoose infrastructure
✅ User / Session / Article contracts
✅ shared error middleware
✅ Axios/shared API infrastructure
✅ React Query / AppProviders / Toaster
✅ auth.store
✅ shared authTokens.js / authSession.js
✅ Login/Register/Session architecture
✅ Current User contract
✅ Users / Top Creators canonical query
✅ Bookmarks canonical endpoints
✅ Articles list/details/create/update/delete contracts
✅ canonical id / avatarUrl naming
✅ Multer/upload error normalization rule
✅ API_CONTRACT
✅ API_CONVENTIONS
✅ VALIDATION_CONTRACT
✅ OWNERSHIP_MAP
✅ DATABASE_ARTICLE_CONTRACT
✅ FRONTEND_LAYOUT_GUIDE
✅ GIT_WORKFLOW
✅ database backup/clean/seed completed
```

---

## 48. Поточний TL фокус перед production

```text
1. Не розширювати scope без необхідності.
2. Закрити regression/retest.
3. Перевірити develop після всіх PR.
4. Frontend: npm run lint + npm run build.
5. Backend: npm run lint (+ build, якщо script існує).
6. Перевірити canonical API Contract.
7. Створити фінальний PR develop → main.
8. Перевірити production deployment.
9. Виконати production smoke-test.
```

Production smoke-test охоплює щонайменше:

```text
GET /api/health
Register
Login
Logout
Session restore
Users / Authors
Articles list
Article details
Create Article
Edit/Delete Article
Bookmarks
Profile
My Articles
Saved Articles
```

## 49. Правило зміни canonical contract

Endpoint, query parameter, body/FormData field, response field, validation rule або HTTP status code не змінюється одноосібно.

Перед зміною:

1. Перевірити `API_CONTRACT.md`.
2. Перевірити `API_CONVENTIONS.md`.
4. Звірити фактичний `develop`.
5. Розбіжність погодити з Team Lead.
6. Після рішення синхронно оновити Backend, Frontend, shared types, QA cases та документацію.

> **One entity — one contract.**

---

## Підсумкова архітектура

``` text
                         DEVELOP
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
       FRONTEND          BACKEND             DOCS
          │                 │
    AppProviders          Express
       │    │               │
       │    └─ Toaster      ├─ Models
       │                    │   ├─ User
       └─ QueryClient       │   └─ Session
                            │
                          modules
                            │
                           auth
                            │
              ┌─────────────┼─────────────┐
              │             │             │
           Register       Login        Session
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                         shared
                     ┌──────┴──────┐
                     │             │
                authTokens.js  authSession.js
```

## Фінальний централізований блок

```text
DEVELOP STABILIZATION
↓
lint / build
↓
QA regression + retest
↓
API Contract verification
↓
PR develop → main
↓
PRODUCTION DEPLOYMENT
↓
PRODUCTION SMOKE-TEST
↓
DEMO / DEFENSE READY
```

**Призначення документа:** актуальний TL master-list --- що вже
централізовано реалізовано, які правила обов'язкові для
feature-учасників і які shared-залежності ще потрібно закрити.
