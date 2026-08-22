# GIT_WORKFLOW.md

> **Назви документації:** у всіх посиланнях використовуються канонічні імена файлів без локальних суфіксів копій на кшталт `(1)`, `(2)`, `(3)` або timestamp у назві.
# Робота з Git

Цей документ визначає єдиний порядок роботи з Git для всіх учасників команди.

---

## Основні гілки

У проєкті використовуються дві основні гілки:

- `main` — стабільна production-версія проєкту;
- `develop` — основна інтеграційна гілка командної розробки.

Працювати безпосередньо в `main` або `develop` заборонено.

Production flow:

```text
feature/fix/chore → develop → main
```

`main` оновлюється тільки через окремий погоджений Pull Request з `develop` після фінальної інтеграційної перевірки.

---

## Feature-гілки

Кожен учасник працює у своїй гілці, визначеній у `OWNERSHIP_MAP.md`.

Єдиний формат назв feature-гілок:

```text
feat/<feature-name>
```

Приклади:

```text
feat/author-profile
feat/login-auth-state
feat/home-page
feat/articles
feat/bookmarks
```

Самостійно перейменовувати призначену гілку або створювати альтернативну гілку для тієї самої feature не потрібно.

---

## Початок роботи

Перед початком роботи необхідно перейти на актуальний `develop`:

```bash
git checkout develop
git pull origin develop
```

Після цього створити призначену feature-гілку, якщо її ще немає локально:

```bash
git checkout -b feat/<feature-name>
```

Приклад:

```bash
git checkout -b feat/author-profile
```

Назва гілки повинна відповідати назві, визначеній у `OWNERSHIP_MAP.md`.

---

## Робота над задачею

Усі зміни виконуються лише у власній `feat/...` гілці.

Під час роботи необхідно:

- дотримуватися своєї ownership-зони;
- не змінювати чужий код без погодження;
- перед змінами у shared-коді перевірити, чи не працює з ним інший учасник;
- регулярно синхронізуватися з актуальним `develop`, особливо перед відкриттям Pull Request.

---

## Commit Convention

Використовуйте такі префікси:

```text
feat:      новий функціонал
fix:       виправлення помилки
refactor:  рефакторинг
style:     форматування або стилі
docs:      документація
test:      тести
chore:     технічні зміни
```

Приклади:

```text
feat: add author profile page
feat: create bookmarks endpoint
fix: correct articles pagination
refactor: split profile service
docs: update team rules
```

Commit повинен описувати завершену логічну частину роботи.

---

## Push змін

Приклад:

```bash
git add .
git commit -m "feat: add author profile page"
git push origin feat/author-profile
```

Перед `git add .` перевірте:

```bash
git status
```

Щоб випадкові, локальні або секретні файли не потрапили в commit.

---

## Pull Request

Після завершення кожної feature відкривається Pull Request у `develop`.

Основна схема:

```text
develop
   │
   └── feat/author-profile
            │
            └── Pull Request
                     │
                     ▼
                  develop
```

Pull Request створюється лише після самоперевірки feature.

Перед PR необхідно виконати перевірки у відповідній частині monorepo.

Backend:

```bash
cd backend
npm run lint
```

Якщо backend має build script — також:

```bash
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Перед production PR `develop → main` перевірки виконуються повторно вже на актуальному інтегрованому `develop`.


---

## Sub-feature гілки

За замовчуванням додаткові sub-feature гілки не створюються.

Кожен учасник працює у своїй призначеній `feat/...` гілці та після завершення feature створює Pull Request у `develop`.

Якщо велика feature дійсно потребує поділу на незалежні sub-feature, структура гілок попередньо погоджується з Team Lead.

У такому випадку:

```text
sub-feature
    │
    └── Pull Request
             │
             ▼
       основна feature
```

Після завершення всієї основної feature:

```text
основна feature
      │
      └── Pull Request
               │
               ▼
            develop
```

Самостійно створювати додаткову ієрархію sub-feature гілок не потрібно.

---

## Shared Route Handlers

Next.js Route Handlers знаходяться у frontend-частині проєкту та можуть належати до shared-зони.

Якщо для своєї feature учаснику необхідно додати або змінити Route Handler:

1. Оновити свою `feat/...` гілку актуальними змінами з `develop`.
2. Перевірити, чи відповідний shared-файл не змінюється іншим учасником.
3. Внести лише зміни, необхідні для своєї feature.
4. Не створювати окрему parent/sub-feature ієрархію тільки через роботу з Route Handler.
5. Додати зміни у звичайний Pull Request своєї `feat/...` гілки в `develop`.

Якщо зміна Route Handler впливає на кілька feature або API-контракт, її потрібно погодити до реалізації.

Перед зміною endpoint, query/body/FormData field, response field, validation rule або HTTP status code потрібно звірити:

- `API_CONTRACT.md`;
- `API_CONVENTIONS.md`;
- актуальний `develop`.

Після погодженої зміни синхронно оновлюються Backend, Frontend, shared types, QA cases та документація.

---

## Code Review

Після відкриття Pull Request:

- автор PR самостійно переглядає `Files changed`;
- reviewer перевіряє відповідність ТЗ, ownership, структуру та якість коду;
- усі зауваження потрібно виправити;
- після виправлень повідомити про готовність до повторної перевірки.

---

## Merge

Merge виконується лише після:

- успішного Code Review;
- усунення всіх зауважень;
- успішного `lint` і `build`;
- перевірки API Contract для змін, які зачіпають інтеграцію;
- погодження Pull Request відповідно до процесу команди.

Самостійно виконувати Merge в `main` або `develop` без погодженого Pull Request не дозволяється.

Для production merge:

```text
develop → main
```

додатково необхідні:

- актуальний `develop`;
- відсутність невирішених merge conflicts;
- зелені CI/checks;
- успішний frontend build;
- backend lint/build відповідно до scripts;
- production smoke-test після deployment.

---

## Синхронізація гілки та non-fast-forward

Якщо `git push` відхилено з повідомленням:

```text
fetch first
non-fast-forward
```

не використовуйте `--force` для командної feature/shared гілки.

Спочатку:

```bash
git status
```

Якщо tracked working tree чистий:

```bash
git pull --rebase origin <branch-name>
```

Після успішного rebase:

```bash
git push origin <branch-name>
```

Якщо під час rebase виник conflict:

1. Визначити ownership конфліктних файлів.
2. Виправити лише ті конфлікти, рішення по яких зрозуміле та погоджене.
3. Додати виправлений файл:

```bash
git add <file>
```

4. Продовжити:

```bash
git rebase --continue
```

Для повного скасування незавершеного rebase:

```bash
git rebase --abort
```

`git push --force` або `git push --force-with-lease` не використовуються без окремого погодження Team Lead.

---

## Локальні та службові файли

Перед `git add .` обов'язково:

```bash
git status
```

У репозиторій не повинні випадково потрапляти:

```text
.env
.env.*
MongoDB backups
database dumps
локальні export JSON
тимчасові debug/log файли
секрети та credentials
```

Такі файли потрібно зберігати локально та, коли це доречно, додавати у `.gitignore`.

Backup production/staging database не комітиться у Git.


---

## Merge Conflict

Якщо виник Merge Conflict, спочатку потрібно визначити, які файли він зачіпає.

### Конфлікт у межах власної feature

Якщо конфлікт:

- стосується лише файлів власної feature;
- не зачіпає shared-код;
- не зачіпає ownership іншого учасника;
- не змінює спільну архітектуру або API-контракт,

учасник може вирішити його самостійно.

Після вирішення конфлікту потрібно повторно перевірити працездатність своєї feature.

### Конфлікт у shared-коді або чужій ownership-зоні

Не вирішуйте конфлікт самостійно, якщо він зачіпає:

- shared-компоненти;
- shared-типи;
- глобальні стилі або конфігурацію;
- Route Handlers, які використовуються кількома feature;
- API-контракти;
- структуру проєкту;
- файли іншого учасника;
- код, для якого незрозуміло, яку версію потрібно залишити.

У такому випадку потрібно повідомити відповідального учасника та, якщо потрібне технічне або архітектурне рішення, Team Lead.

Не видаляйте і не перезаписуйте чужі зміни лише для того, щоб формально закрити Merge Conflict.

---

## Заборонено

- працювати безпосередньо у `main`;
- працювати безпосередньо у `develop`;
- використовувати інший naming замість призначеного `feat/...`;
- створювати зайві sub-feature гілки без погодження;
- використовувати одну гілку для кількох незалежних feature;
- виконувати Merge без Pull Request;
- виконувати прямий production merge feature → `main`;
- використовувати `git push --force` без погодження Team Lead;
- комітити `.env`, credentials, database backup/dump або локальні службові exports;
- змінювати чужу ownership-зону без погодження;
- змінювати canonical API Contract одноосібно;
- ігнорувати зауваження Code Review.

---

## Основна схема роботи

```text
Оновити develop
        │
        ▼
Перейти / створити призначену feature/fix/chore гілку
        │
        ▼
Реалізувати зміни у своїй ownership-зоні
        │
        ▼
Перевірити API Contract, якщо зміна інтеграційна
        │
        ▼
lint / build / самоперевірка
        │
        ▼
Commit
        │
        ▼
Push
        │
        ▼
Pull Request → develop
        │
        ▼
Code Review + CI
        │
        ▼
Merge у develop
        │
        ▼
Фінальна інтеграційна перевірка develop
        │
        ▼
Pull Request develop → main
        │
        ▼
Production deployment
        │
        ▼
Production smoke-test
```


---

## Production deployment workflow

Фінальний production release виконується тільки з `main`.

Перед release:

```bash
git checkout develop
git pull origin develop
```

Після локальних/CI перевірок створюється:

```text
Pull Request: develop → main
```

Після merge:

```bash
git checkout main
git pull origin main
```

Production hosting повинен бути налаштований на deployment з `main`.

Після deployment перевіряються щонайменше:

```text
Backend health
Home
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

Якщо production smoke-test виявив regression, нове виправлення виконується через окрему `fix/...` гілку та Pull Request, а не прямим редагуванням `main`.
