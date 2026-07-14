export default function PrototypePreview() {
  return (
    <a
      href="/MA-HomeAssignment/demo"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open the Card Bounty interactive prototype"
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-cm-violet-deep/15 bg-[#267cbb] shadow-[0_18px_50px_rgba(54,21,98,0.18)]"
    >
      <img
        src="/coinmaster-sky.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.2),transparent_46%),linear-gradient(90deg,rgba(31,20,75,0.3),transparent_35%,transparent_65%,rgba(31,20,75,0.3))]" />
      <img
        src="/coinmaster/prototype.webp"
        alt="Card Bounty prototype showing the selected Card, Bounty meter, and Coin-purchased Chests"
        className="absolute inset-y-[4%] left-1/2 h-[92%] w-auto -translate-x-1/2 rounded-[10px] object-contain shadow-[0_12px_30px_rgba(21,12,54,0.42)] transition-transform duration-300 group-hover:-translate-x-1/2 group-hover:scale-[1.025]"
      />
      <span className="absolute bottom-4 left-1/2 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-b from-[#FFD95C] to-cm-gold px-5 py-2.5 font-sans text-[11px] font-extrabold uppercase tracking-[0.08em] text-cm-violet-deep shadow-[0_3px_0_#B7202E,0_8px_18px_rgba(31,20,75,0.3)] transition-[filter,transform] group-hover:-translate-y-0.5 group-hover:brightness-105"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 7 8 5-8 5V7Z" />
        </svg>
        Open
      </span>
    </a>
  )
}
