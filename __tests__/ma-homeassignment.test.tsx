// __tests__/ma-homeassignment.test.tsx
import { render } from '@testing-library/react'
import MAHomeAssignmentPage, { metadata } from '@/app/MA-HomeAssignment/page'
import * as DemoPage from '@/app/MA-HomeAssignment/demo/page'
import { USE_CASE_2 } from '@/app/MA-HomeAssignment/sections/useCaseData'

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

it('renders every side-nav section anchor', () => {
  render(<MAHomeAssignmentPage />)
  const ids = [
    'hero', 'feature-1', 'feature-2', 'feature-3',
    'prioritization', 'mvp', 'prototype', 'assumptions',
  ]
  for (const id of ids) {
    expect(document.getElementById(id)).toBeInTheDocument()
  }
})

it('renders the Coin Master hero banner', () => {
  render(<MAHomeAssignmentPage />)
  const band = document.getElementById('top')!
  // Coin Master sky/clouds header band (masthead)
  expect(band.className).toContain('coinmaster-sky')
  // chunky display font applied to the title
  const h1 = band.querySelector('h1')!
  expect(h1.className).toContain('text-cm-violet-deep')
})

it('renders the current workflow and the concept mockup in each feature', () => {
  render(<MAHomeAssignmentPage />)
  const feature1 = document.getElementById('feature-1')!
  // concept mockup image sits beside the current workflow
  expect(feature1.querySelector('img[src="/coinmaster/feature1.png"]')).not.toBeNull()
})

it('uses the Card Bounty poster across the feature and prototype previews', () => {
  render(<MAHomeAssignmentPage />)

  expect(USE_CASE_2.mockup).toBe('/coinmaster/card-bounty-preview.webp')
  expect(document.querySelector('#feature-2 img[src="/coinmaster/card-bounty-preview.webp"]')).not.toBeNull()
  expect(document.querySelector('#prototype img[src="/coinmaster/card-bounty-preview.webp"]')).not.toBeNull()
})

it('publishes the Card Bounty poster in the assignment social metadata', () => {
  expect(metadata.openGraph).toEqual(expect.objectContaining({
    images: [expect.objectContaining({
      url: 'https://eliahu.co/coinmaster/card-bounty-preview.jpg',
      width: 860,
      height: 1864,
    })],
  }))
  expect(metadata.twitter).toEqual(expect.objectContaining({
    images: ['https://eliahu.co/coinmaster/card-bounty-preview.jpg'],
  }))
})

it('uses a device-width viewport for the interactive prototype', () => {
  expect((DemoPage as Record<string, unknown>).viewport).toEqual({
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  })
})

it('publishes the Card Bounty poster in the prototype social metadata', () => {
  expect(DemoPage.metadata.openGraph).toEqual(expect.objectContaining({
    images: [expect.objectContaining({
      url: 'https://eliahu.co/coinmaster/card-bounty-preview.jpg',
      width: 860,
      height: 1864,
    })],
  }))
  expect(DemoPage.metadata.twitter).toEqual(expect.objectContaining({
    images: ['https://eliahu.co/coinmaster/card-bounty-preview.jpg'],
  }))
})

it('integrates the Card Bounty prototype without the previous demo placeholder', () => {
  render(<MAHomeAssignmentPage />)
  const prototype = document.getElementById('prototype')!

  expect(prototype.querySelectorAll('a[href="/MA-HomeAssignment/demo"]')).toHaveLength(1)
  expect(prototype.querySelector('img[src="/coinmaster/card-bounty-preview.webp"]')).not.toBeNull()
  expect(prototype.textContent).toContain('Coin-purchased Chests to fill the Bounty meter')
  expect(prototype.textContent).not.toMatch(/Drawing Analyzer|drop chance/i)
  expect(prototype.querySelector('video')).toBeNull()
})
