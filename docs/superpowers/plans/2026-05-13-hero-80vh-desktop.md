# Hero 80vh Desktop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce hero height to 80vh on desktop so the About section peeks below the fold, giving users a visual cue to scroll.

**Architecture:** Single Tailwind class change on the hero `<section>` element. Mobile keeps `h-screen`; desktop (`md:`) overrides to `h-[80vh]`. PanelScene, GSAP ScrollTrigger, and scroll CTA all adapt automatically — no other files touch.

**Tech Stack:** Next.js 15, Tailwind CSS

---

### Task 1: Change hero height

**Files:**
- Modify: `components/Hero.tsx:65`

- [ ] **Step 1: Open `components/Hero.tsx` and find the section element**

  Around line 63–67:

  ```tsx
  <section
    id="hero"
    className="relative h-screen w-full overflow-hidden"
    style={{ background: '#f5f5f5', borderBottom: '2px solid var(--color-orange)' }}
  ```

- [ ] **Step 2: Change the className**

  Replace `h-screen` with `h-screen md:h-[80vh]`:

  ```tsx
  <section
    id="hero"
    className="relative h-screen md:h-[80vh] w-full overflow-hidden"
    style={{ background: '#f5f5f5', borderBottom: '2px solid var(--color-orange)' }}
  ```

- [ ] **Step 3: Visual check**

  Run `npm run dev`. Open the page on a desktop viewport (≥768px). Verify:
  - Hero occupies ~80% of the viewport height.
  - The About section content is visible below the orange bottom border on first load without scrolling.
  - On mobile (DevTools < 768px), hero still fills the full screen.
  - The 3D scene, scroll CTA, and nameplate all look correct within the shorter hero.

- [ ] **Step 4: Commit**

  ```bash
  git add components/Hero.tsx
  git commit -m "feat(hero): 80vh height on desktop to reveal content below fold"
  ```

- [ ] **Step 5: Push**

  ```bash
  git push
  ```
