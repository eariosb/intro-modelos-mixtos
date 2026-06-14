'use client';

import { useState } from 'react';

export interface FlashcardData {
  front: string;
  back: string;
}

/**
 * A single flip-card: click to reveal the back. Used to drill key
 * definitions and concepts (e.g. "¿Qué es un efecto aleatorio?").
 */
function FlipCard({ front, back }: FlashcardData) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
      className="group flex min-h-[120px] flex-col justify-center rounded border border-ink-200 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
    >
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-accent-600">
        {flipped ? 'Respuesta' : 'Concepto · clic para ver la respuesta'}
      </p>
      <p className="text-sm text-ink-800">{flipped ? back : front}</p>
    </button>
  );
}

/**
 * Grid of flashcards for quick concept review at the end of a section.
 */
export function Flashcard({ cards, title }: { cards: FlashcardData[]; title?: string }) {
  if (!cards?.length) return null;
  return (
    <section className="my-8">
      <h3 className="mb-3 text-lg font-semibold text-ink-900">
        {title ?? 'Repaso rápido: flashcards'}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <FlipCard key={c.front} front={c.front} back={c.back} />
        ))}
      </div>
    </section>
  );
}
