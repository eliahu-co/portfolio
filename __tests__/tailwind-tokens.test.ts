// __tests__/tailwind-tokens.test.ts
import config from '../tailwind.config'

it('defines the Coin Master palette without touching existing tokens', () => {
  const colors = (config.theme?.extend?.colors ?? {}) as Record<string, string>
  expect(colors['cm-violet']).toBe('#3B1F63')
  expect(colors['cm-violet-deep']).toBe('#2A1B54')
  expect(colors['cm-gold']).toBe('#F5A800')
  expect(colors['cm-gold-bright']).toBe('#FFC93C')
  expect(colors['cm-coin']).toBe('#FFCB70')
  expect(colors['cm-wood']).toBe('#903900')
  expect(colors['cm-sky']).toBe('#4FBFEF')
  expect(colors['cm-crimson']).toBe('#C8102E')
  expect(colors['cm-cream']).toBe('#FFF9EE')
  // originals untouched
  expect(colors['autodesk-blue']).toBe('#0696d7')
  expect(colors['charcoal']).toBe('#666666')
})
