# project-webcrafters-03 — OWNERSHIP MAP (Карта відповідальності)

## 1. Архітектура репозиторію

Проєкт ведеться в одному monorepo:

```text
project-webcrafters-03/
├── frontend/
├── backend/
├── docs/
└── .github/
```

Frontend і Backend не розділяються на окремі репозиторії.

---

# 2. Загальна структура проєкту

Нижче наведена погоджена структура monorepo. Учасники не створюють альтернативні кореневі папки та не переносять свої модулі в інші місця без погодження з Team Lead.

```text
project-webcrafters-03/
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/
│   ├── API_CONTRACT.md
│   ├── API_CONVENTIONS.md
│   ├── DATABASE_ARTICLE_CONTRACT.md
│   ├── FRONTEND_LAYOUT_GUIDE.md
│   ├── GIT_WORKFLOW.md
│   ├── OWNERSHIP_MAP.md
│   ├── TEAM_RULES.md
│   ├── TL_MASTER_LIST.md
│
├── frontend/
│   ├── public/
│   │   ├── icons/
│   │   └── images/
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── LoginPage.module.css
│   │   │   │   ├── photo/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── PhotoPage.module.css
│   │   │   │   └── register/
│   │   │   │       ├── page.tsx
│   │   │   │       └── RegisterPage.module.css
│   │   │   │
│   │   │   ├── (main)/
│   │   │   │   ├── articles/
│   │   │   │   │   ├── [articleId]/
│   │   │   │   │   │   ├── loading.tsx
│   │   │   │   │   │   ├── not-found.tsx
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── ArticlePage.module.css
│   │   │   │   │   ├── create/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── CreateArticlePage.module.css
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── ArticlesPage.module.css
│   │   │   │   ├── authors/
│   │   │   │   │   ├── [userId]/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── AuthorPage.module.css
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── AuthorsPage.module.css
│   │   │   │   ├── profile/
│   │   │   │   │   ├── @myArticles/
│   │   │   │   │   │   ├── default.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── @savedArticles/
│   │   │   │   │   │   ├── default.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── ProfilePage.module.css
│   │   │   │   ├── HomePage.module.css
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── api/
│   │   │   │   ├── articles/
│   │   │   │   │   ├── [articleId]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/route.ts
│   │   │   │   │   ├── register/route.ts
│   │   │   │   │   └── session/route.ts
│   │   │   │   └── users/
│   │   │   │       ├── [userId]/
│   │   │   │       │   ├── articles/route.ts
│   │   │   │       │   └── route.ts
│   │   │   │       ├── me/
│   │   │   │       │   ├── bookmarks/
│   │   │   │       │   │   ├── [articleId]/route.ts
│   │   │   │       │   │   └── route.ts
│   │   │   │       │   └── route.ts
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── error.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   └── not-found.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── Footer/
│   │   │   ├── Header/
│   │   │   ├── layout/
│   │   │   ├── providers/
│   │   │   └── ui/
│   │   │       ├── Button/
│   │   │       ├── Container/
│   │   │       ├── EmptyState/
│   │   │       ├── ErrorState/
│   │   │       ├── Loader/
│   │   │       ├── LoadMoreButton/
│   │   │       ├── Modal/
│   │   │       └── SectionTitle/
│   │   │
│   │   ├── features/
│   │   │   ├── articles/
│   │   │   │   ├── catalog/
│   │   │   │   ├── create/
│   │   │   │   ├── details/
│   │   │   │   └── shared/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── photo/
│   │   │   │   ├── register/
│   │   │   │   └── session/
│   │   │   ├── authors/
│   │   │   │   └── author-articles/
│   │   │   ├── home/
│   │   │   ├── profile/
│   │   │   │   ├── my-articles/
│   │   │   │   └── saved-articles/
│   │   │   └── user/
│   │   │       ├── profile-edit/
│   │   │       └── user-bar/
│   │   │
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   └── api/
│   │   │       └── client.ts
│   │   ├── services/
│   │   ├── store/
│   │   │   └── auth.store.ts
│   │   ├── styles/
│   │   └── types/
│   │
│   ├── .env.example
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── db/
│   │   │   └── connectMongoDB.ts
│   │   ├── middlewares/
│   │   │   ├── authenticate.ts
│   │   │   ├── controllerWrapper.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   └── validateRequest.ts
│   │   ├── models/
│   │   │   ├── Article.ts
│   │   │   ├── Session.ts
│   │   │   └── User.ts
│   │   ├── modules/
│   │   │   ├── articles/
│   │   │   │   ├── create/
│   │   │   │   ├── details/
│   │   │   │   ├── list/
│   │   │   │   └── manage/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── session/
│   │   │   ├── health/
│   │   │   └── users/
│   │   │       ├── articles/
│   │   │       ├── bookmarks/
│   │   │       ├── details/
│   │   │       ├── list/
│   │   │       └── me/
│   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── seed/
│   │   │   └── seed.ts
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Призначення основних папок

### `frontend/src/app`

Містить сторінки, layouts, loading/error/not-found файли та Next.js Route Handlers. Бізнес-логіку і великі компоненти у `app` не розміщуємо.

### `frontend/src/features`

Містить функціонал за доменами: компоненти, hooks, schemas, services і локальні types конкретної фічі.

### `frontend/src/components`

Містить глобальні компоненти, які використовуються в різних фічах: Header, Footer, providers і shared UI.

### `frontend/src/app/api`

Містить Next.js Route Handlers. Вони проксіюють запити до Express Backend та не повинні дублювати бізнес-логіку Backend.

### `backend/src/modules`

Містить Backend-функціонал за окремими доменами. Кожен модуль повинен мати route, controller, service, validation і types.

### `backend/src/models`

Містить спільні MongoDB-моделі. Owner — Team Lead. Учасники не змінюють моделі без погодження.

### `docs`

Містить правила команди, API-контракт, критерії готовності та цей ownership map.

### `.github`

Містить CI та шаблон Pull Request.

Кожен учасник №2–13 відповідає за:

- дві Frontend-фічі;
- один Express Backend route;
- один Next.js Route Handler;
- інтеграцію власного Frontend із Backend;
- самостійну перевірку;
- Pull Request у `develop`.

---

# 3. Загальні правила ownership

1. Кожен учасник працює тільки у своїх папках.
2. Shared-файли можуть мати конкретного owner.
3. Інші учасники не змінюють shared-файли без погодження з owner і Team Lead.
4. Центральне підключення Express router у `backend/src/routes/index.js` виконує Team Lead.
5. Route Handler у Next.js створює учасник, за яким закріплений відповідний Backend route.
6. Next Route Handler використовується як проксі:

```text
Frontend component
→ frontend/src/app/api/**/route.ts
→ Express Backend
```

7. Усі зміни API-контракту погоджуються з Team Lead.
8. Кожен учасник працює у власній feature-гілці.

---

# 4. Учасник №1 (ПОЛЕЦЬ Віталій) — (Team Lead)

## Гілка

```text
chore/project-setup
```

## Frontend-папки

```text
frontend/package.json
frontend/tsconfig.json
frontend/next.config.ts
frontend/eslint.config.mjs
frontend/.env.example

frontend/src/app/layout.tsx
frontend/src/app/loading.tsx
frontend/src/app/error.tsx
frontend/src/app/not-found.tsx
frontend/src/app/globals.css
frontend/src/lib/api/client.ts
frontend/src/types/
```

## Backend-папки

```text
backend/package.json
backend/tsconfig.json
backend/.env.example
backend/src/app.js
backend/src/server.js
backend/src/config/
backend/src/db/
backend/src/middlewares/
backend/src/models/
backend/src/routes/index.js
backend/src/types/
backend/src/utils/
```

## Документація та GitHub

```text
docs/
.github/
```

## Системні маршрути

```text
GET /api/health
```

## Обов’язки

- створити структуру проєкту;
- погодити API-контракт;
- погодити спільні типи;
- перевіряти Pull Request;
- підключати Express router;
- вирішувати конфлікти;
- контролювати CI;
- проводити інтеграцію;
- виконувати фінальний merge.

---

# 5. Учасник №2 (КАРПЕНКО Вікторія) — Реєстрація і завантаження фото

## Гілка

```text
feat/register
```

## Frontend URL

```text
/register
/photo
```

## Frontend-папки

```text
frontend/src/app/(auth)/register/
frontend/src/app/(auth)/photo/

frontend/src/features/auth/register/
frontend/src/features/auth/photo/
```

## Next Route Handler

```text
frontend/src/app/api/auth/register/route.ts
```

Метод:

```text
POST /api/auth/register
```

Route Handler проксіює запит до Express:

```text
POST {BACKEND_URL}/api/auth/register
```

## Backend-маршрут

```text
POST /api/auth/register
```

## Backend-папка

```text
backend/src/modules/auth/register/
├── register.route.js
├── register.controller.js
├── register.service.js
├── register.validation.js
├── register.types.js
└── index.ts
```

## Не змінювати без погодження

```text
frontend/src/store/auth.store.ts
backend/src/models/User.js
backend/src/routes/index.js
```

---

# 6. Учасник №3 (МІТЬКО Андрій) — Login, auth state та route guards

## Гілка

```text
feat/login-auth-state
```

## Frontend URL

```text
/login
```

## Frontend-папки

```text
frontend/src/app/(auth)/login/

frontend/src/features/auth/login/
frontend/src/features/auth/session/

frontend/src/store/auth.store.ts
```

`auth.store.ts` має owner — учасник №3.

Team Lead погоджує структуру store, але основну реалізацію виконує учасник №3.

Інші учасники можуть використовувати store, але не редагувати його без погодження.

## Захищені сторінки

```text
/profile
/articles/create
```

## Гостьові сторінки

Авторизований користувач не повинен відкривати:

```text
/register
/login
/photo
```

## Next Route Handler

```text
frontend/src/app/api/auth/login/route.ts
```

## Backend-маршрут

```text
POST /api/auth/login
```

## Backend-папка

```text
backend/src/modules/auth/login/
├── login.route.js
├── login.controller.js
├── login.service.js
├── login.validation.js
├── login.types.js
└── index.ts
```

---

# 7. Учасник №4 (ТАР Віктор) — Layout, Providers, Footer та Shared UI

## Гілка

```text
feat/layout-shared-ui
```

## Frontend-папки

```text
frontend/src/components/layout/
frontend/src/components/Footer/
frontend/src/components/ui/
frontend/src/components/providers/
```

`frontend/src/components/providers/` має owner — учасник №4.

Інші учасники не змінюють providers без погодження з №4 і Team Lead.

Рекомендована структура:

```text
frontend/src/components/providers/
├── AppProviders.tsx
├── QueryProvider.tsx
└── index.ts
```

## Next Route Handlers

```text
frontend/src/app/api/auth/session/route.ts
```

Методи:

```text
POST /api/auth/session
DELETE /api/auth/session
```

## Backend-маршрут

```text
/api/auth/session
```

Методи:

```text
POST /api/auth/session
DELETE /api/auth/session
```

## Backend-папка

```text
backend/src/modules/auth/session/
├── session.route.js
├── session.controller.js
├── session.service.js
├── session.validation.js
├── session.types.js
└── index.ts
```

---

# 8. Учасник №5 (ФІГЛЕВСЬКА Юлія) — Header, UserBar і поточний користувач

## Гілка

```text
feat/header-user
```

## Frontend-папки

```text
frontend/src/components/Header/

frontend/src/features/user/user-bar/
frontend/src/features/user/profile-edit/
```

## Header links

```text
/
/articles
/authors
/login
/register
/profile
/articles/create
```

## Next Route Handler

```text
frontend/src/app/api/users/me/route.ts
```

Методи:

```text
GET /api/users/me
PATCH /api/users/me
```

## Backend-маршрут

```text
/api/users/me
```

Методи:

```text
GET /api/users/me
PATCH /api/users/me
```

## Backend-папка

```text
backend/src/modules/users/me/
├── me.route.js
├── me.controller.js
├── me.service.js
├── me.validation.js
├── me.types.js
└── index.ts
```

---

# 9. Учасник №6 (ЮРʼЄВ Тимофій) — HomePage, Popular Articles і Top Creators

## Гілка

```text
feat/home-page
```

## Frontend URL

```text
/
```

## Frontend-папки

```text
frontend/src/app/(main)/page.tsx
frontend/src/app/(main)/HomePage.module.css

frontend/src/features/home/
├── components/
│   ├── Hero/
│   ├── About/
│   ├── PopularArticles/
│   └── TopCreators/
├── home.service.js
├── home.types.js
└── index.ts
```

## Next Route Handler

```text
frontend/src/app/api/users/route.ts
```

Підтримувані query:

```text
?page=1
&perPage=6
&sort=articlesAmount
```

## Backend-маршрут

```text
GET /api/users
```

## Backend-папка

```text
backend/src/modules/users/list/
├── users-list.route.js
├── users-list.controller.js
├── users-list.service.js
├── users-list.validation.js
├── users-list.types.js
└── index.ts
```

---

# 10. Учасник №7 (КОШУЦЬКА Анастасія) — AuthorsPage і дані окремого автора

## Гілка

```text
feat/authors
```

## Frontend URL

```text
/authors
/authors/[userId]
```

## Frontend-папки

```text
frontend/src/app/(main)/authors/page.tsx
frontend/src/app/(main)/authors/AuthorsPage.module.css

frontend/src/app/(main)/authors/[userId]/page.tsx
frontend/src/app/(main)/authors/[userId]/AuthorPage.module.css

frontend/src/features/authors/components/AuthorsList/
frontend/src/features/authors/components/AuthorsItem/
frontend/src/features/authors/components/AuthorInfo/
frontend/src/features/authors/authors.service.js
frontend/src/features/authors/authors.types.js
```

Учасник №7 відповідає тільки за загальні дані автора.

Список статей автора виконує учасник №8.

## Next Route Handler

```text
frontend/src/app/api/users/[userId]/route.ts
```

## Backend-маршрут

```text
GET /api/users/:userId
```

## Backend-папка

```text
backend/src/modules/users/details/
├── user-details.route.js
├── user-details.controller.js
├── user-details.service.js
├── user-details.validation.js
├── user-details.types.js
└── index.ts
```

---

# 11. Учасник №8 (ХМАЛ Юлія) Scrum Master — Статті автора та каркас ProfilePage

## Гілка

```text
feat/author-profile
```

## Frontend URL

```text
/authors/[userId]
/profile
```

## Frontend-папки — статті автора

```text
frontend/src/features/authors/author-articles/
├── components/AuthorArticles/
├── author-articles.service.js
├── author-articles.types.js
└── index.ts
```

## Frontend-папки — ProfilePage

Учасник №8 має виключне право редагувати:

```text
frontend/src/app/(main)/profile/layout.tsx
frontend/src/app/(main)/profile/page.tsx
frontend/src/app/(main)/profile/ProfilePage.module.css

frontend/src/features/profile/components/ProfileInfo/
frontend/src/features/profile/components/ProfileTabs/
frontend/src/features/profile/profile.service.js
frontend/src/features/profile/profile.types.js
```

Учасник №8:

- створює каркас ProfilePage;
- отримує поточного користувача;
- показує аватар, ім’я та кількість статей;
- створює ProfileTabs;
- підключає slots parallel routes;
- не реалізує вміст My Articles та Saved Articles.

## Next Route Handler

```text
frontend/src/app/api/users/[userId]/articles/route.ts
```

## Backend-маршрут

```text
GET /api/users/:userId/articles
```

## Backend-папка

```text
backend/src/modules/users/articles/
├── user-articles.route.js
├── user-articles.controller.js
├── user-articles.service.js
├── user-articles.validation.js
├── user-articles.types.js
└── index.ts
```

---

# 12. Учасник №9 (ГРИЩЕНКО Вадим) — My Articles, Saved Articles і bookmarks

## Гілка

```text
feat/profile-articles-bookmarks
```

## Frontend URL

Основний URL:

```text
/profile
```

Для стану вкладок використовуємо query parameters:

```text
/profile?tab=my-articles
/profile?tab=saved-articles
```

Parallel route slots самі не створюють URL.

Не використовуємо окремі URL:

```text
/profile/my-articles
/profile/saved-articles
```

## Frontend-папки

```text
frontend/src/app/(main)/profile/@myArticles/
├── default.tsx
└── page.tsx

frontend/src/app/(main)/profile/@savedArticles/
├── default.tsx
└── page.tsx

frontend/src/features/profile/my-articles/
frontend/src/features/profile/saved-articles/
```

Учасник №9 не змінює:

```text
frontend/src/app/(main)/profile/layout.tsx
frontend/src/app/(main)/profile/page.tsx
frontend/src/features/profile/components/ProfileInfo/
frontend/src/features/profile/components/ProfileTabs/
```

## Next Route Handler

```text
frontend/src/app/api/users/me/bookmarks/route.ts
frontend/src/app/api/users/me/bookmarks/[articleId]/route.ts
```

Методи:

```text
GET    /api/users/me/bookmarks
POST   /api/users/me/bookmarks
DELETE /api/users/me/bookmarks/:articleId
```

## Backend-маршрут

```text
GET    /api/users/me/bookmarks
POST   /api/users/me/bookmarks
DELETE /api/users/me/bookmarks/:articleId
```

Остаточний DELETE endpoint:

```text
DELETE /api/users/me/bookmarks/:articleId
```

Body для POST:

```json
{
  "articleId": "ARTICLE_ID"
}
```

Для DELETE `articleId` передається через URL params.

## Backend-папка

```text
backend/src/modules/users/bookmarks/
├── bookmarks.route.js
├── bookmarks.controller.js
├── bookmarks.service.js
├── bookmarks.validation.js
├── bookmarks.types.js
└── index.ts
```

---

# 13. Учасник №10 (ТКАЧОВА Анастасія) — ArticlePage і рекомендації

## Гілка

```text
feat/article-page
```

## Frontend URL

```text
/articles/[articleId]
```

## Frontend-папки

```text
frontend/src/app/(main)/articles/[articleId]/
├── page.tsx
├── loading.tsx
├── not-found.tsx
└── ArticlePage.module.css

frontend/src/features/articles/details/
├── components/
│   ├── ArticleDetails/
│   ├── ArticleAuthor/
│   └── ArticleRecommendations/
├── article-details.service.js
├── article-details.types.js
└── index.ts
```

## Next Route Handler

```text
frontend/src/app/api/articles/[articleId]/route.ts
```

У цьому файлі учасник №10 реалізує тільки:

```text
GET
```

## Backend-маршрут

```text
GET /api/articles/:articleId
```

Відповідь:

```text
article
author
isBookmarked
recommendations
```

## Backend-папка

```text
backend/src/modules/articles/details/
├── article-details.route.js
├── article-details.controller.js
├── article-details.service.js
├── article-details.validation.js
├── article-details.types.js
└── index.ts
```

---

# 14. Учасник №11 (МАЦЮК Анастасія) — ArticlesPage, filters і pagination

## Гілка

```text
feat/articles-page
```

## Frontend URL

```text
/articles
```

Фільтри:

```text
/articles?filter=all
/articles?filter=popular
```

## Frontend-папки

```text
frontend/src/app/(main)/articles/page.tsx
frontend/src/app/(main)/articles/loading.tsx
frontend/src/app/(main)/articles/ArticlesPage.module.css

frontend/src/features/articles/catalog/
├── components/
│   ├── ArticlesCatalog/
│   ├── ArticlesFilters/
│   └── ArticlesCounter/
├── hooks/useArticlesQuery.ts
├── articles-catalog.service.js
├── articles-catalog.types.js
└── index.ts
```

## Next Route Handler

```text
frontend/src/app/api/articles/route.ts
```

У цьому файлі учасник №11 реалізує тільки:

```text
GET
```

Підтримувані query:

```text
?page=1
&perPage=8
&filter=all
&filter=popular
&authorId=...
&excludeId=...
&limit=...
```

## Backend-маршрут

```text
GET /api/articles
```

## Backend-папка

```text
backend/src/modules/articles/list/
├── articles-list.route.js
├── articles-list.controller.js
├── articles-list.service.js
├── articles-list.validation.js
├── articles-list.types.js
└── index.ts
```

---

# 15. Учасник №12 (СОБЧУК Ярослав) — ArticlesItem, BookmarkButton та article management

## Гілка

```text
feat/article-components-management
```

## Frontend-папки

```text
frontend/src/features/articles/shared/
├── components/
│   ├── ArticlesItem/
│   ├── ArticlesList/
│   ├── BookmarkButton/
│   └── ModalErrorSave/
├── article-shared.types.js
└── index.ts
```

Компоненти використовуються на:

```text
/
/articles
/articles/[articleId]
/authors/[userId]
/profile
```

## Next Route Handler

Файл спільний за URL:

```text
frontend/src/app/api/articles/[articleId]/route.ts
```

Учасник №12 реалізує в ньому тільки:

```text
PATCH
DELETE
```

Учасник №10 реалізує в тому самому Route Handler метод `GET`.

Щоб уникнути конфлікту:

1. №10 першим створює файл із `GET`.
2. Після merge №12 оновлює `develop`.
3. №12 додає `PATCH` і `DELETE`.
4. Одночасне редагування цього файлу заборонене.

## Backend-маршрут

```text
PATCH  /api/articles/:articleId
DELETE /api/articles/:articleId
```

## Backend-папка

```text
backend/src/modules/articles/manage/
├── article-manage.route.js
├── article-manage.controller.js
├── article-manage.service.js
├── article-manage.validation.js
├── article-manage.types.js
└── index.ts
```

---

# 16. Учасник №13 (МЕНДЕЛЬ Тетяна) — CreateArticlePage

## Гілка

```text
feat/create-article
```

## Frontend URL

```text
/articles/create
```

## Frontend-папки

```text
frontend/src/app/(main)/articles/create/
├── page.tsx
└── CreateArticlePage.module.css

frontend/src/features/articles/create/
├── components/
│   ├── AddArticleForm/
│   └── ArticleImagePreview/
├── create-article.schema.ts
├── create-article.service.js
├── create-article.types.js
└── index.ts
```

## Next Route Handler

```text
frontend/src/app/api/articles/route.ts
```

Учасник №13 реалізує в цьому файлі тільки:

```text
POST
```

Учасник №11 реалізує `GET`.

Щоб уникнути конфлікту:

1. №11 першим створює файл із `GET`.
2. Після merge №13 оновлює `develop`.
3. №13 додає `POST`.
4. Одночасне редагування заборонене.

## Backend-маршрут

```text
POST /api/articles
```

## Backend-папка

```text
backend/src/modules/articles/create/
├── article-create.route.js
├── article-create.controller.js
├── article-create.service.js
├── article-create.validation.js
├── article-create.types.js
└── index.ts
```

---

# 17. Повна карта Frontend URL

```text
/                         — №6
/register                 — №2
/photo                    — №2
/login                    — №3
/authors                  — №7
/authors/[userId]         — №7 і №8
/articles                 — №11
/articles/[articleId]     — №10
/articles/create          — №13
/profile                  — №8 і №9
```

Profile tabs:

```text
/profile?tab=my-articles
/profile?tab=saved-articles
```

---

# 18. Повна карта Next Route Handlers

```text
frontend/src/app/api/auth/register/route.ts
POST                                      — №2

frontend/src/app/api/auth/login/route.ts
POST                                      — №3

frontend/src/app/api/auth/session/route.ts
POST, DELETE                              — №4

frontend/src/app/api/users/me/route.ts
GET, PATCH                                — №5

frontend/src/app/api/users/route.ts
GET                                       — №6

frontend/src/app/api/users/[userId]/route.ts
GET                                       — №7

frontend/src/app/api/users/[userId]/articles/route.ts
GET                                       — №8

frontend/src/app/api/users/me/bookmarks/route.ts
GET, POST                                 — №9

frontend/src/app/api/users/me/bookmarks/[articleId]/route.ts
DELETE                                    — №9

frontend/src/app/api/articles/[articleId]/route.ts
GET                                       — №10
PATCH, DELETE                             — №12

frontend/src/app/api/articles/route.ts
GET                                       — №11
POST                                      — №13
```

---

# 19. Повна карта Express Backend

```text
GET    /api/health                         — Team Lead

POST   /api/auth/register                  — №2
POST   /api/auth/login                     — №3
POST   /api/auth/session                   — №4
DELETE /api/auth/session                   — №4

GET    /api/users/me                       — №5
PATCH  /api/users/me                       — №5
GET    /api/users                          — №6
GET    /api/users/:userId                  — №7
GET    /api/users/:userId/articles         — №8

GET    /api/users/me/bookmarks             — №9
POST   /api/users/me/bookmarks             — №9
DELETE /api/users/me/bookmarks/:articleId  — №9

GET    /api/articles/:articleId            — №10
GET    /api/articles                       — №11
PATCH  /api/articles/:articleId            — №12
DELETE /api/articles/:articleId            — №12
POST   /api/articles                       — №13

```

---

# 20. Shared-файли та їх залежність за членом команди

```text
frontend/src/store/auth.store.ts
Відповідає: №3
```

```text
frontend/src/components/providers/
Відповідає: №4
```

```text
frontend/src/app/(main)/profile/layout.tsx
frontend/src/app/(main)/profile/page.tsx
frontend/src/features/profile/components/ProfileInfo/
frontend/src/features/profile/components/ProfileTabs/
Відповідає: №8
```

```text
frontend/src/app/(main)/profile/@myArticles/
frontend/src/app/(main)/profile/@savedArticles/
frontend/src/features/profile/my-articles/
frontend/src/features/profile/saved-articles/
Відповідає: №9
```

```text
frontend/src/app/api/articles/[articleId]/route.ts
GET Відповідає: №10
PATCH/DELETE Відповідає: №12
```

```text
frontend/src/app/api/articles/route.ts
GET Відповідає: №11
POST Відповідає: №13
```

Інші shared-файли:

```text
frontend/src/app/layout.tsx
frontend/src/app/globals.css
frontend/src/lib/api/client.ts
frontend/src/types/

backend/src/app.js
backend/src/server.js
backend/src/routes/index.js
backend/src/models/
backend/src/middlewares/
backend/src/config/
backend/src/db/
```

Відовідає за ці файи — Team Lead.

---

# 21. Порядок роботи зі shared Route Handler

Якщо два учасники працюють з одним `route.ts`:

1. Перший owner завершує та об’єднує свій метод.
2. Другий учасник виконує:

```bash
git checkout develop
git pull origin develop
git checkout feature-гілка
git merge develop
```

3. Другий додає тільки свій HTTP-метод.
4. Не переписує вже готовий метод.
5. Перед PR перевіряє всі методи файла.

---

# 22. Остаточні рішення

- Репозиторій один: `project-webcrafters-03`.
- Frontend і Backend розташовані в одному monorepo.
- Кожен учасник №2–13 має Next Route Handler.
- `auth.store.ts` належить №3.
- `components/providers` належить №4.
- Profile layout і tabs належать №8.
- Profile article slots належать №9.
- Parallel routes не створюють окремі URL.
- Profile tabs використовують `/profile?tab=...`.
- Bookmarks DELETE:

```text
DELETE /api/users/me/bookmarks/:articleId
```

- Центральне підключення Express router виконує Team Lead.

---

# 23. Останнє канонічне погодження (19–21.08.2026)

Цей розділ має пріоритет у разі конфлікту зі старішими прикладами вище.

- Backend використовує `.js`, а не `.ts`, для modules, models, middleware, config та routes.
- `/api/categories` та `/api-docs` не входять до поточної канонічної implemented route map, оскільки їх немає в актуальному `backend/src/routes/index.js`.
- `GET /api/users`: canonical pagination — `page` + `perPage`; `limit` не є частиною контракту `/users`.
- Top Creators: `GET /api/users?page=1&perPage=6&sort=articlesAmount`.
- `GET /api/articles`: `limit` поки залишається підтримуваним, доки окремо не погоджено його видалення.
- Bookmarks DELETE: `DELETE /api/users/me/bookmarks/:articleId`; `articleId` передається через URL params, не через body.
- Canonical public ID — `id`; `_id` залишається внутрішнім Mongo/Mongoose полем.
- User responses використовують `avatarUrl`, а не `avatar`.
- Canonical article list response має бути єдиним для списків статей.
- Article full text: `article` — 100..4000 символів.
- `description` — server-derived і не є client-editable полем.
- `category` не входить до Create/PATCH body.
- Create article author визначається з authenticated user, не з request body.
- Image upload: один файл, JPEG/PNG/WEBP, max 1 MB.
- Invalid explicit query/params values повертають `400`, а не мовчки нормалізуються.
- Upload/Multer validation errors нормалізуються в контрольований `4xx`, не `500`.
- Frontend Yup validation повинна дзеркалити Backend validation.
- Shared backend infrastructure (`routes/index.js`, middlewares, models, config, utils, `auth/shared`, `articles/shared`) змінюється тільки з координацією Team Lead.

## Актуальна shared backend infrastructure

```text
backend/src/routes/index.js
backend/src/middlewares/authenticate.js
backend/src/middlewares/controllerWrapper.js
backend/src/middlewares/errorHandler.js
backend/src/middlewares/upload.js
backend/src/middlewares/articleUpload.js
backend/src/models/
backend/src/config/
backend/src/utils/
backend/src/modules/auth/shared/
backend/src/modules/articles/shared/
```
