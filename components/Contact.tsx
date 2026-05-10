// components/Contact.tsx

const LINKS = [
  {
    label: 'hi@eliahu.co',
    href: 'mailto:hi@eliahu.co',
    external: false,
    download: false,
  },
  {
    label: 'LinkedIn ↗',
    href: 'https://www.linkedin.com/in/eliahu-cohen-b32374114',
    external: true,
    download: false,
  },
  {
    label: 'Download CV ↓',
    href: '/cv.pdf',
    external: false,
    download: true,
  },
]

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-ink text-canvas px-8 py-32 md:px-16 lg:px-24"
      style={{ zIndex: 1 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-[clamp(36px,5vw,56px)] leading-tight mb-4">
          Let&apos;s build something.
        </h2>

        <p className="font-sans text-[14px] text-canvas/50 mb-16 tracking-wide">
          Based in Tel Aviv. Open to hybrid and remote.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {LINKS.map(({ label, href, external, download }) => (
            <a
              key={href}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              {...(download ? { download: true } : {})}
              className="font-sans text-[14px] text-canvas/50 hover:text-canvas transition-colors duration-200 underline-offset-4 hover:underline"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
