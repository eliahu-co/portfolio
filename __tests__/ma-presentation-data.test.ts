import {
  APPROACH_STEPS,
  ASSUMPTION_STORIES,
  CLOSING_GROUPS,
  CONCEPTS,
  PLAYER_FLOW,
  RECOMMENDATION,
  SCORE_STORIES,
  SCOPE_STORIES,
} from '@/app/MA-HomeAssignment/presentation/deckData'
import { ASSUMPTIONS } from '@/app/MA-HomeAssignment/content/assumptions'
import { SCOPE_IN, SCOPE_OUT } from '@/app/MA-HomeAssignment/content/mvp'
import { SCORE_ROWS } from '@/app/MA-HomeAssignment/content/prioritization'
import {
  USE_CASE_1,
  USE_CASE_2,
  USE_CASE_3,
} from '@/app/MA-HomeAssignment/sections/useCaseData'

describe('MA presentation story data', () => {
  it('composes the three concepts from the canonical assignment fields', () => {
    const sources = [USE_CASE_1, USE_CASE_2, USE_CASE_3]

    expect(CONCEPTS).toHaveLength(sources.length)
    CONCEPTS.forEach((concept, index) => {
      const source = sources[index]

      expect(concept.id).toBe(source.id)
      expect(concept.title).toBe(source.title)
      expect(concept.mockup).toBe(source.mockup)
      expect(concept.strategy).toBe(source.monetizationStrategy)
      expect(concept.loop).toBe(source.currentWorkflow)
      expect(concept.values).toBe(source.value)
      expect(concept.risks).toBe(source.tradeoffs)
    })
  })

  it('keeps presentation-facing concept data free of legacy AEC labels', () => {
    const serialized = JSON.stringify(CONCEPTS)

    expect(serialized).not.toMatch(
      /Change Validation|Context Link|Coordination Lock|Conformance Review/i,
    )
  })

  it('pairs every visible loop step with a presentation implication', () => {
    CONCEPTS.forEach((concept) => {
      expect(concept.loopImplications).toHaveLength(concept.loop.steps.length)
      expect(concept.loopImplications.every(Boolean)).toBe(true)
      expect(concept.thesis).toEqual(expect.any(String))
      expect(concept.monetizationSummary).toEqual(expect.any(String))
      expect(concept.reveals.length).toBeGreaterThan(0)
    })
  })

  it('derives assumptions, score rows, and MVP boundaries from shared content', () => {
    expect(ASSUMPTION_STORIES.map(({ assumption }) => assumption)).toEqual(ASSUMPTIONS)
    expect(SCORE_STORIES.map(({ row }) => row)).toEqual(SCORE_ROWS)
    expect(SCOPE_STORIES.in.map(({ requirement }) => requirement)).toEqual(SCOPE_IN)
    expect(SCOPE_STORIES.out.map(({ requirement }) => requirement)).toEqual(SCOPE_OUT)

    SCORE_STORIES.forEach(({ row }, index) => {
      expect(row).toBe(SCORE_ROWS[index])
    })
  })

  it('provides only the approved presentation annotations for later chapters', () => {
    expect(APPROACH_STEPS).toHaveLength(6)
    expect(ASSUMPTION_STORIES).toHaveLength(5)
    expect(RECOMMENDATION.evidence).toHaveLength(3)
    expect(PLAYER_FLOW).toHaveLength(6)
    expect(CLOSING_GROUPS.map(({ slide }) => slide)).toEqual([3, 5, 13, 15, 18])
  })
})
