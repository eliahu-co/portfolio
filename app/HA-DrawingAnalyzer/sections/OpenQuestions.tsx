// app/HA-DrawingAnalyzer/sections/OpenQuestions.tsx
// Section 9 — Open questions I'd bring to the team.

import Section from './Section'

const QUESTIONS = [
  'TODO: Question about data access / training data.',
  'TODO: Question about the go-to-market or target segment.',
  'TODO: Question about integration constraints with existing products.',
  'TODO: Question about how success is measured internally.',
]

export default function OpenQuestions() {
  return (
    <Section id="open-questions" eyebrow="Open questions" title="What I'd ask the team">
      <ol className="max-w-2xl flex flex-col gap-4 list-none m-0 p-0">
        {QUESTIONS.map((q, i) => (
          <li key={i} className="flex gap-3">
            <span className="font-serif text-[18px] text-autodesk-blue shrink-0 leading-snug">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-sans text-[14px] leading-relaxed text-charcoal">{q}</span>
          </li>
        ))}
      </ol>
    </Section>
  )
}
