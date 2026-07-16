export function PrototypeCard() {
  return (
    <section
      aria-label="Interactive Card Bounty prototype"
      className="relative grid min-h-[440px] grid-cols-[1.35fr_0.65fr] items-center gap-8 overflow-hidden rounded-[28px] border-2 border-cm-gold/55 bg-cm-violet-deep p-6 shadow-[0_18px_40px_rgba(42,27,84,0.22)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/coinmaster-sky.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cm-violet-deep/45 via-cm-violet-deep/80 to-cm-violet-deep" />

      <figure
        data-prototype-viewport="true"
        className="relative z-10 h-[390px] overflow-hidden rounded-2xl border-2 border-white/65 bg-cm-cream shadow-[0_14px_34px_rgba(0,0,0,0.24)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/coinmaster/prototype.webp"
          alt="Card Bounty prototype preview"
          className="block h-full w-full object-cover object-[center_43%]"
        />
      </figure>

      <div className="relative z-10 text-white">
        <p className="font-sans text-[14px] font-extrabold uppercase tracking-[0.12em] text-cm-gold">
          Clickable product walkthrough
        </p>
        <h3 className="mt-3 font-serif text-[40px] font-black leading-[1.04]">
          Try the bounty loop
        </h3>
        <p className="mt-5 font-sans text-[18px] leading-relaxed text-white/90">
          Choose a missing Card, compare Chest progress, and test the guarantee path in the interactive demo.
        </p>
        <a
          href="/MA-HomeAssignment/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-cm-wood/70 bg-cm-gold px-6 py-3 font-sans text-[16px] font-extrabold text-cm-violet-deep shadow-[0_8px_0_rgba(73,45,20,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]"
        >
          Open interactive prototype
          <span aria-hidden="true" className="ml-2">↗</span>
        </a>
      </div>
    </section>
  )
}
