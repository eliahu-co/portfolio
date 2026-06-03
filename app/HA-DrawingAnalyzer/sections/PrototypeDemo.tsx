// app/HA-DrawingAnalyzer/sections/PrototypeDemo.tsx
// Section 8 — Prototype demo. Local <video> element (matches how the site
// serves its own media from /public). Drop the file in /public and update src.

import Section from './Section'

export default function PrototypeDemo() {
  return (
    <Section id="prototype" eyebrow="Prototype demo" title="Walkthrough">
      <div className="max-w-3xl">
        <div
          className="relative w-full overflow-hidden bg-charcoal/5 border-2 border-autodesk-blue"
          style={{ aspectRatio: '16 / 9', borderRadius: '2px' }}
        >
          {/* TODO: place the demo file at /public/ha-drawing-analyzer-demo.mp4
              (and an optional poster image), then this will play inline. */}
          <video
            className="w-full h-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster="/ha-drawing-analyzer-poster.jpg"
          >
            <source src="/ha-drawing-analyzer-demo.mp4" type="video/mp4" />
            TODO: Your browser does not support the video tag — add the demo file.
          </video>
        </div>

        <p className="font-sans text-[12px] leading-relaxed text-charcoal/80 mt-3">
          {/* TODO: caption describing what the demo shows. */}
          TODO: Caption — what this prototype demonstrates and what to watch for.
        </p>
      </div>
    </Section>
  )
}
