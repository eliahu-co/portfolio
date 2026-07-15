# Player Motivation and Monetization Strategy Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe each feature's positive outcomes as player motivations and replace all three monetization strategies with approved regular-weight copy.

**Architecture:** Keep the existing card component and `value` data key so the visual system remains unchanged. Simplify `monetizationStrategy` to a string and render it directly as ordinary body copy, then update only the shared heading and feature content objects.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Jest, Testing Library

## Global Constraints

- Rename `Value delivered & risks` to `Player motivation & risks` everywhere it renders.
- Preserve every existing risk title, description, and style exactly.
- Preserve the current positive-card styling, layout, spacing, typography, and responsive behavior.
- Render Monetization Strategy as regular 14px charcoal body text with no bold text.
- Hometown strategy is exactly `New spend surface` with no terminal period.
- Do not change Metrics, Loop, Concept, prioritization, MVP, Success Metrics, mockups, or the interactive prototype.
- Do not stage or commit the unrelated modified `card-bounty-final-polish` plan or spec files.

---

### Task 1: Update player motivation and strategy content

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/UseCase.tsx`
- Modify: `app/MA-HomeAssignment/sections/useCaseData.ts`

**Interfaces:**
- Consumes: `UseCaseData` objects for Hometown, Card Bounty, and Hot Trail.
- Produces: `monetizationStrategy?: string` and unchanged `value: TitledItem[]` / `tradeoffs: TitledItem[]` rendering.

- [ ] **Step 1: Write failing copy and rendering regression tests**

Add this exact data regression:

```tsx
it('defines the approved player motivations and plain monetization strategies', () => {
  expect([USE_CASE_1, USE_CASE_2, USE_CASE_3].map((data) => ({
    title: data.title,
    strategy: data.monetizationStrategy,
    motivations: data.value,
    risks: data.tradeoffs,
  }))).toEqual([
    {
      title: 'Hometown',
      strategy: 'New spend surface',
      motivations: [
        { title: 'Expression and Ownership', body: 'A permanent space that feels personal.' },
        { title: 'Progress and Status', body: 'High-level Village items become proof of progress.' },
        { title: 'Social Recognition', body: 'Visits, reactions and snapshots create an audience.' },
      ],
      risks: [
        { title: 'Core Cannibalization', body: 'May slow Village progression.' },
        { title: 'Paying Twice', body: 'Charging for Village built items may feel unfair.' },
        { title: 'Weak Customization Demand', body: 'Customization value depends on audience.' },
      ],
    },
    {
      title: 'Card Bounty',
      strategy: 'Resource demand. Targets players close to completing a Card Collection increasing Coin consumption and demand for existing offers.',
      motivations: [
        { title: 'Agency', body: 'Choose the Card that matters most.' },
        { title: 'Visible Progress', body: 'Every Chest advances toward a guaranteed result.' },
      ],
      risks: [
        { title: 'System Cannibalization', body: 'Reduced value of Jokers, trading and Cards for Chests.' },
        { title: 'Collection Acceleration', body: 'Collection rewards released faster than intended.' },
        { title: 'Spend Shifting', body: 'Chest spending shifts to the event without increasing total spend.' },
      ],
    },
    {
      title: 'Hot Trail',
      strategy: 'Purchase frequency through re-engagement.',
      motivations: [
        { title: 'Urgency', body: 'A limited window creates a reason to return.' },
        { title: 'Recovery and Revenge', body: 'Respond directly to a Raid and recover part of the loss.' },
      ],
      risks: [
        { title: 'Retaliation Loops', body: 'Repeated Counter-Raids between the same players.' },
        { title: 'Failed Urgency', body: 'Spins consumed without landing a Raid before the timer expires.' },
        { title: 'Economy Distortion', body: 'Recovered Coins inflate the economy or weaken core-loop demand.' },
      ],
    },
  ])
})
```

Add this rendering regression:

```tsx
it('renders player motivation framing and unbolded monetization strategy copy', () => {
  render(<MAHomeAssignmentPage />)

  ;[USE_CASE_1, USE_CASE_2, USE_CASE_3].forEach((data) => {
    const feature = document.getElementById(data.id)!
    const motivationHeading = Array.from(feature.querySelectorAll('p')).find(
      (node) => node.textContent === 'Player motivation & risks'
    )
    const strategyHeadings = Array.from(feature.querySelectorAll('p')).filter(
      (node) => node.textContent === 'Monetization Strategy'
    )

    expect(motivationHeading).toBeDefined()
    expect(feature.textContent).not.toContain('Value delivered & risks')
    expect(strategyHeadings).toHaveLength(2)
    strategyHeadings.forEach((heading) => {
      const strategyParagraph = heading.parentElement!.querySelector('p:not(:first-child)')!
      expect(strategyParagraph.textContent).toBe(data.monetizationStrategy)
      expect(strategyParagraph.querySelector('strong')).toBeNull()
      expect(strategyParagraph.className).toContain('text-[14px]')
      expect(strategyParagraph.className).toContain('text-charcoal')
    })
  })
})
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx -t "approved player motivations|player motivation framing"
```

Expected: FAIL because the data still uses strategy objects and the old value heading/copy.

- [ ] **Step 3: Simplify the strategy type and renderer**

In `UseCaseData`, replace the strategy object with:

```ts
monetizationStrategy?: string
```

Replace the strategy helper with:

```tsx
function MonetizationStrategy({ strategy }: { strategy: string }) {
  return (
    <p className="font-sans text-[14px] leading-relaxed text-charcoal">
      {strategy}
    </p>
  )
}
```

Keep the existing call site:

```tsx
<MonetizationStrategy strategy={data.monetizationStrategy} />
```

- [ ] **Step 4: Apply the exact heading, strategy, and motivation copy**

Change the shared block label to:

```tsx
<Block label="Player motivation & risks">
```

Set Hometown content to:

```ts
monetizationStrategy: 'New spend surface',
value: [
  { title: 'Expression and Ownership', body: 'A permanent space that feels personal.' },
  { title: 'Progress and Status', body: 'High-level Village items become proof of progress.' },
  { title: 'Social Recognition', body: 'Visits, reactions and snapshots create an audience.' },
],
```

Set Card Bounty content to:

```ts
monetizationStrategy: 'Resource demand. Targets players close to completing a Card Collection increasing Coin consumption and demand for existing offers.',
value: [
  { title: 'Agency', body: 'Choose the Card that matters most.' },
  { title: 'Visible Progress', body: 'Every Chest advances toward a guaranteed result.' },
],
```

Set Hot Trail content to:

```ts
monetizationStrategy: 'Purchase frequency through re-engagement.',
value: [
  { title: 'Urgency', body: 'A limited window creates a reason to return.' },
  { title: 'Recovery and Revenge', body: 'Respond directly to a Raid and recover part of the loss.' },
],
```

Do not edit any `tradeoffs` array.

- [ ] **Step 5: Run focused and full automated verification**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx
npm.cmd test -- --runInBand
```

Expected: The assignment suite and full repository suite pass.

Move only the ignored `.next` cache to a validated temporary path before building because OneDrive marks generated files as reparse points:

```powershell
$workspace = (Resolve-Path -LiteralPath '.').Path
if (Test-Path -LiteralPath '.next') {
  $source = (Resolve-Path -LiteralPath '.next').Path
  $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
  $destination = Join-Path $tempRoot ('portfolio-next-stale-' + [DateTime]::Now.ToString('yyyyMMdd-HHmmss'))
  if (-not $source.StartsWith($workspace, [StringComparison]::OrdinalIgnoreCase)) { throw "Source escaped workspace: $source" }
  if (-not ([IO.Path]::GetFullPath($destination)).StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase)) { throw "Destination escaped temp: $destination" }
  Move-Item -LiteralPath $source -Destination $destination
}
npm.cmd run build
```

Run whitespace checks only against task-owned paths so unrelated shared-workspace edits do not block this task:

```powershell
git diff --check -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/UseCase.tsx app/MA-HomeAssignment/sections/useCaseData.ts
```

Expected: Build succeeds and task-owned files contain no whitespace errors.

- [ ] **Step 6: Visually verify desktop and mobile layouts**

Inspect `/MA-HomeAssignment` at desktop and mobile widths. Verify all three features show the new heading and motivation copy, strategy text is regular weight, positive/risk cards retain the existing layout, and neither breakpoint has horizontal overflow.

- [ ] **Step 7: Commit only task-owned implementation files**

```powershell
git add __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/UseCase.tsx app/MA-HomeAssignment/sections/useCaseData.ts
git commit -m "copy: reframe feature value as player motivation"
```

Confirm the two unrelated `card-bounty-final-polish` documentation files remain unstaged and unchanged by this task.
