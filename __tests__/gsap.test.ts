// __tests__/gsap.test.ts
import { gsap, ScrollTrigger } from '@/lib/gsap'

it('exports gsap instance', () => {
  expect(gsap).toBeDefined()
  expect(typeof gsap.to).toBe('function')
})

it('exports ScrollTrigger', () => {
  expect(ScrollTrigger).toBeDefined()
})
