# Loop Resource Indicators Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add approved right-aligned Coin and Spin deltas to the Hot Trail loop.

**Architecture:** Extend the canonical workflow-step data with an optional resource delta. Render the shared indicator in `FeatureSlide`, while Hot Trail remains the only concept supplying delta data in this iteration.

**Tech Stack:** TypeScript, React, Next.js Image, Tailwind CSS, Jest Testing Library

## Global Constraints

- Preserve existing loop geometry, arrows, return arrow, colors, and interaction behavior.
- Keep Hometown and Card Bounty unchanged.
- Use existing transparent assets in `public/coinmaster/resources`.

---

### Task 1: Hot Trail resource delta contract and rendering

**Files:**
- Modify: `app/MA-HomeAssignment/sections/UseCase.tsx`
- Modify: `app/MA-HomeAssignment/sections/useCaseData.ts`
- Modify: `app/MA-HomeAssignment/presentation/components/FeatureSlide.tsx`
- Test: `__tests__/ma-presentation-concepts.test.tsx`

**Interfaces:**
- Consumes: `WorkflowStep`
- Produces: optional `resourceDelta: { resource: 'coin' | 'spin'; direction: 'spend' | 'gain' }`

- [ ] Add failing assertions for shortened Hot Trail labels and four resource indicators.
- [ ] Run the focused test and confirm it fails because indicators do not exist.
- [ ] Add the optional workflow data contract and Hot Trail values.
- [ ] Render an absolute right-edge indicator with sign, emoji, and accessible text.
- [ ] Run the focused test, full suite, and production build.
