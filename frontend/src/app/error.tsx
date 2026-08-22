'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main>
      <h1>Сталася помилка</h1>
      <button type="button" onClick={reset}>Спробувати ще раз</button>
    </main>
  );
}
