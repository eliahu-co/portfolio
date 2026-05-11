import Cursor from '@/components/Cursor'

/* ─── data ─────────────────────────────────────────────────────────────────── */

const CONTACT = [
  { label: 'Email',    value: 'hi@eliahu.co',           href: 'mailto:hi@eliahu.co' },
  { label: 'LinkedIn', value: 'eliahu-cohen-b32374114', href: 'https://www.linkedin.com/in/eliahu-cohen-b32374114' },
  { label: 'Phone',    value: '+972 52 890 1495',        href: 'tel:+972528901495' },
  { label: 'Location', value: 'Tel Aviv · open to remote', href: null },
]

const LANGUAGES = [
  { lang: 'English',    level: 'Native' },
  { lang: 'Portuguese', level: 'Native' },
  { lang: 'Spanish',    level: 'Native' },
  { lang: 'Hebrew',     level: 'Working' },
]

const SKILLS = [
  'React · Next.js · Node.js',
  'Python · FastAPI',
  'Revit · BIM · IFC',
  'Three.js · WebGL',
  'Product Management · PRDs',
  'CAD-to-CAM Pipelines',
  'Research & Development',
]

const EDUCATION = [
  {
    school:  'Israel Tech Challenge',
    degree:  'Full-Stack Development',
    period:  '2022 – 2023',
  },
  {
    school:  'Pontifícia Universidade Católica do RS',
    degree:  'B.Arch — Architecture & Urbanism',
    period:  '2012 – 2017',
  },
  {
    school:  'University of Groningen',
    degree:  'Urban Planning, Design & Society',
    period:  '2014 – 2015',
  },
  {
    school:  'Vrije Universiteit Amsterdam',
    degree:  'Creativity & Innovation',
    period:  '2016',
  },
]

const EXPERIENCE = [
  {
    company:  'Veev, By Lennar',
    location: 'Tel Aviv, Israel',
    roles: [
      {
        title:  'Senior R&D Product Architect',
        period: '2024 – Present',
        bullets: [
          'Embedded part-time in the engineering team as a contributing developer — leading POC development to validate new technical approaches and de-risk product decisions before full implementation.',
          'Promoted from R&D Product Architect within 3 years based on scope expansion and measurable cross-team impact.',
        ],
      },
      {
        title:  'R&D Product Architect',
        period: '2021 – 2024',
        bullets: [
          'Led end-to-end product development: requirements definition, technology research, prototyping, testing, and production rollout.',
          'Drove cross-functional collaboration between BIM, Data, Automation, and Manufacturing teams to advance digital-twin and CAD-to-CAM workflows.',
          'Evaluated emerging technologies and recommended implementation strategies, directly shaping the company\'s technical roadmap.',
        ],
      },
    ],
  },
  {
    company:  'HQ Architects',
    location: 'Tel Aviv, Israel',
    roles: [
      {
        title:  'Architect & Creative Director',
        period: '2019 – 2021',
        bullets: [
          'Coordinated national and international RFQ submissions, resulting in design awards including the Integrated Transportation Centers by NTA, in collaboration with SOM and ARUP.',
          'Designed and developed the studio\'s website from scratch, owning the full digital presence.',
        ],
      },
    ],
  },
  {
    company:  'Volta Objects',
    location: 'Brazil',
    roles: [
      {
        title:  'Founding Partner',
        period: '2017 – 2019',
        bullets: [
          'Co-founded a furniture design studio. Drove product development, 3D modeling, technical drafting in BIM, and graphic design for surface patterns including terrazzo.',
          'Managed vendor relationships, supply chain, and production logistics.',
        ],
      },
    ],
  },
  {
    company:  'Arquitetura Nacional',
    location: 'Brazil',
    roles: [
      {
        title:  'Junior Architect',
        period: '2016 – 2018',
        bullets: [
          'Developed full construction documents, BIM models, material specifications, and custom furniture drawings across projects from concept to execution.',
          'Created design presentations, competition submissions, and FF&E packages.',
        ],
      },
    ],
  },
  {
    company:  'Onix Architecten',
    location: 'Netherlands',
    roles: [
      {
        title:  'Junior Architect',
        period: '2015 – 2016',
        bullets: [
          'Developed wood construction solutions and detail drawings, supporting the planning team on execution plans.',
        ],
      },
    ],
  },
  {
    company:  'CNPq',
    location: 'Brazil',
    roles: [
      {
        title:  'Scientific Researcher',
        period: '2012 – 2013',
        bullets: [
          'Conducted research on mass-produced social housing units for the National Council for Scientific and Technological Development.',
        ],
      },
    ],
  },
]

/* ─── sub-components ────────────────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-ink/40 mb-3">
      {children}
    </p>
  )
}

function SectionBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t-2 border-ink pt-4 mb-8">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

/* ─── page ──────────────────────────────────────────────────────────────────── */

export default function CVPage() {
  return (
    <>
      <Cursor />
      <div className="min-h-screen bg-canvas text-ink">

        {/* ── Masthead ── */}
        <header className="border-b-2 border-ink px-8 py-8 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            <div>
              <h1
                className="text-[52px] leading-none nabla-black"
                style={{ fontFamily: 'var(--font-nabla)' }}
              >
                Eliahu Cohen
              </h1>
              <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-ink/50 mt-3">
                Architect · Developer · Builder
              </p>
            </div>

            <div className="flex flex-col gap-1 md:items-end">
              {CONTACT.map(({ label, value, href }) => (
                <div key={label} className="flex items-baseline gap-2">
                  <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-ink/35">{label}</span>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-sans text-[11px] text-ink hover:text-ink/60 transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="font-sans text-[11px] text-ink/70">{value}</span>
                  )}
                </div>
              ))}
            </div>

          </div>
        </header>

        {/* ── Body ── */}
        <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24 py-10 grid md:grid-cols-[280px_1fr] gap-12">

          {/* ── Left sidebar ── */}
          <aside>

            <SectionBlock label="Summary">
              <p className="font-sans text-[13px] leading-relaxed text-ink/80">
                After a decade spanning architectural practice across Brazil, the Netherlands, and Israel,
                I spent the last five years at Veev as a Senior R&amp;D Product Architect — owning the full
                product lifecycle from PRDs and technology research to hands-on BIM, data, and manufacturing
                pipelines. In my last year I embedded part-time in the engineering team, shipping production
                code alongside the core dev squad.
              </p>
            </SectionBlock>

            <SectionBlock label="Skills">
              <ul className="flex flex-col gap-2">
                {SKILLS.map(s => (
                  <li
                    key={s}
                    className="font-sans text-[11px] text-ink/80 border border-ink/15 px-3 py-1.5 rounded-sm"
                    style={{ background: '#D6BF7822' }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </SectionBlock>

            <SectionBlock label="Languages">
              <ul className="flex flex-col gap-2">
                {LANGUAGES.map(({ lang, level }) => (
                  <li key={lang} className="flex justify-between items-baseline">
                    <span className="font-sans text-[12px] text-ink/80">{lang}</span>
                    <span className="font-sans text-[9px] uppercase tracking-[0.1em] text-ink/35">{level}</span>
                  </li>
                ))}
              </ul>
            </SectionBlock>

            <SectionBlock label="Education">
              <ul className="flex flex-col gap-5">
                {EDUCATION.map(({ school, degree, period }) => (
                  <li key={school}>
                    <p className="font-serif text-[14px] text-ink leading-snug">{school}</p>
                    <p className="font-sans text-[11px] text-ink/60 mt-0.5">{degree}</p>
                    <p className="font-sans text-[9px] uppercase tracking-[0.1em] text-ink/35 mt-1">{period}</p>
                  </li>
                ))}
              </ul>
            </SectionBlock>

          </aside>

          {/* ── Main experience ── */}
          <main>
            <div className="border-t-2 border-ink pt-4 mb-8">
              <Label>Experience</Label>

              <div className="flex flex-col gap-10">
                {EXPERIENCE.map(({ company, location, roles }) => (
                  <div key={company}>

                    {/* Company header */}
                    <div className="flex items-baseline justify-between mb-4">
                      <h2 className="font-serif text-[22px] text-ink">{company}</h2>
                      <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-ink/35 ml-4 shrink-0">
                        {location}
                      </span>
                    </div>

                    {/* Roles */}
                    <div className="flex flex-col gap-6 pl-4 border-l-2 border-ink/10">
                      {roles.map(({ title, period, bullets }) => (
                        <div key={title}>
                          <div className="flex items-baseline justify-between mb-2">
                            <h3 className="font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-ink/70">
                              {title}
                            </h3>
                            <span className="font-sans text-[9px] uppercase tracking-[0.1em] text-ink/35 ml-4 shrink-0">
                              {period}
                            </span>
                          </div>
                          <ul className="flex flex-col gap-1.5">
                            {bullets.map((b, i) => (
                              <li key={i} className="font-sans text-[13px] leading-relaxed text-ink/70 flex gap-2">
                                <span className="text-ink/25 mt-1 shrink-0">—</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </main>

        </div>

        {/* ── Footer ── */}
        <footer className="border-t-2 border-ink px-8 py-5 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <a
              href="/"
              className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink/40 hover:text-ink transition-colors"
            >
              ← Portfolio
            </a>
            <a
              href="/cv.pdf"
              download
              className="font-sans text-[10px] uppercase tracking-[0.12em] px-4 py-2 transition-colors"
              style={{
                background: '#D6BF78',
                border: 'var(--border)',
                borderRadius: '2px',
              }}
            >
              Download PDF ↓
            </a>
          </div>
        </footer>

      </div>
    </>
  )
}
