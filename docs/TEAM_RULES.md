# TEAM_RULES.md

> **Назви документації:** у всіх посиланнях використовуються канонічні імена файлів без локальних суфіксів копій на кшталт `(1)`, `(2)`, `(3)` або timestamp у назві.
# Правила роботи команди

## 1. Мета

Ці правила визначають єдиний порядок роботи команди під час розробки проєкту Harmoniq.

---

# 2. Ролі

## Team Lead

Відповідає за:

- розподіл задач;
- координацію роботи команди;
- контроль архітектурних рішень;
- перевірку Pull Request;
- взаємодію з ментором;
- вирішення організаційних питань;
- контроль shared/core infrastructure;
- погодження змін canonical API Contract;
- контроль фінальної інтеграції `develop → main`;
- контроль production readiness та smoke-test.

## Учасник команди

Відповідає за:

- реалізацію своєї feature;
- якість власного коду;
- своєчасне усунення зауважень після Code Review;
- дотримання правил команди;
- роботу лише у своїй ownership-зоні;
- локальну перевірку `lint` / `build` перед PR.

---

## 3. Комунікація та робота з блокерами

Основний канал комунікації команди — Slack.

Якщо учасник не може продовжувати виконання задачі через blocker, він повинен:

1. Перевести відповідну картку на Project Board у статус Blocked.
2. У картці коротко вказати:
   - причину блокування;
   - від чого або від кого залежить продовження роботи;
   - що вже було перевірено або зроблено для вирішення проблеми.
3. Повідомити про blocker у командному каналі Slack.

### Scrum Master

Scrum Master допомагає усунути блокери, пов'язані з:

- залежностями між задачами;
- необхідністю синхронізації учасників;
- організаційними питаннями;
- статусами та актуальністю задач на Project Board;
- ситуаціями, коли одна задача очікує завершення іншої.

### Team Lead

Blocker ескалюється до Team Lead, якщо для його вирішення необхідне:

- технічне рішення;
- архітектурне рішення;
- зміна структури проєкту;
- зміна API-контракту;
- зміна спільних компонентів або типів;
- вирішення складного Git-конфлікту;
- рішення, яке впливає на декілька feature або на весь проєкт.

---

# 4. Робота зі спільним кодом

Забороняється:

- змінювати чужий код без погодження;
- створювати дублікати компонентів;
- створювати дублікати типів;
- змінювати структуру проєкту без погодження;
- змінювати shared/core infrastructure без погодження Team Lead;
- одноосібно змінювати endpoint, query/body/FormData field, response field, validation rule або HTTP status code;
- створювати альтернативні Axios clients, providers, auth/session mechanisms або глобальні layouts без погодження.

Перед створенням нового компонента необхідно перевірити, чи вже не існує аналогічне рішення.

До shared/core належать, зокрема:

```text
shared UI
Axios/API client
AppProviders
QueryClientProvider
Toaster
auth.store.ts
authTokens.js
authSession.js
shared middleware
shared Route Handler/API infrastructure
global layouts
API contracts
```

Owner feature використовує shared API, але не змінює його контракт без погодження.

---

# 5. API Contract

Для інтеграційної роботи обов'язковими є:

```text
OWNERSHIP_MAP.md
API_CONTRACT.md
API_CONVENTIONS.md
```

Основні правила:

- public API identifier — `id`; MongoDB `_id` не змішується з frontend API types;
- User API response використовує `avatarUrl`;
- `/users` використовує `page`, `perPage`, `sort`; `limit` не є canonical параметром `/users`;
- Top Creators: `GET /api/users?page=1&perPage=6&sort=articlesAmount`;
- Bookmarks DELETE: `DELETE /api/users/me/bookmarks/:articleId`;
- private endpoint використовують Bearer access token;
- invalid ObjectId / body / query / upload validation повертає контрольований `4xx`;
- Multer/upload validation error не повинен ставати `500`;
- Frontend validation повинна відповідати правилам, зафіксованим у `API_CONTRACT.md` та фактичному Backend contract.

### Article Create

```text
title             3..48
article           100..4000
publicationDate   YYYY-MM-DD
image             JPEG/PNG/WEBP, max 1 MB
```

Client не передає `authorId`, `description`, `category`, `viewsCount`, `imageUrl`, `imagePublicId`.

### Article PATCH

Client-editable:

```text
title
article
publicationDate
image
```

Поля optional, але потрібно передати щонайменше одне поле або image. Constraints не послаблюються порівняно з Create.

> **One entity — one contract.**


---

# 6. Code Review

Кожен Pull Request проходить перевірку.

Після отримання зауважень необхідно:

1. внести виправлення;
2. повідомити про готовність до повторної перевірки.

Merge виконується лише після погодження.

---

# 7. Стандарти коду

Команда використовує єдиний стиль коду.

Обов'язково:

- ESLint;
- Prettier;
- зрозумілі назви файлів, компонентів і функцій;
- охайний та читабельний код.

---

# 8. Відповідальність

Кожен учасник відповідає за:

- працездатність своєї feature;
- відповідність технічному завданню;
- відсутність помилок, які він міг перевірити самостійно;
- positive/negative cases своєї feature;
- виправлення regression у своїй ownership-зоні;
- відповідність актуальній документації та погодженому contract.

---

# 9. Git / PR / Production workflow

Робочий flow:

```text
feature/fix/chore
↓
Pull Request
↓
Code Review + CI
↓
develop
↓
фінальна інтеграційна перевірка
↓
Pull Request develop → main
↓
production deployment
↓
production smoke-test
```

Перед PR:

```text
git status
lint
build
```

Для синхронізації feature/shared гілки:

```bash
git fetch origin
git rebase origin/develop
```

Якщо push відхилено через `non-fast-forward`, не використовувати `--force` без погодження Team Lead.

Не комітити:

```text
.env
credentials/secrets
MongoDB backup/dump
локальні PR JSON exports
debug/log artifacts
```

Перед production merge `develop → main` мають бути зелені CI/checks, успішний frontend build, backend lint/build відповідно до scripts та завершений regression/retest.


---

# 10. Заборонено

- Комітити напряму в `main`.
- Комітити напряму в `develop`.
- Виконувати Merge без Pull Request.
- Ігнорувати зауваження Code Review.
- Вносити зміни до чужої feature без погодження.
- Робити прямий feature → `main` merge.
- Використовувати `git push --force` без погодження Team Lead.
- Комітити `.env`, secrets, database backups/dumps або локальні службові exports.
- Одноосібно змінювати canonical API Contract.
- Перетворювати контрольовані Backend `4xx` на штучні `500`.
- Розширювати scope feature під час stabilization без погодження.

---

# 11. Головне правило

Якщо виникають сумніви щодо реалізації, ownership, API Contract або архітектури, спочатку обговоріть питання з Team Lead або командою, а вже потім починайте реалізацію.

Під час stabilization пріоритет — стабільність уже реалізованого функціоналу, regression/retest та готовність `develop` до production, а не додавання непогодженого нового scope.
