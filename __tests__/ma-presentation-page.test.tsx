import { metadata, revalidate } from '@/app/MA-HomeAssignment/presentation/page'

describe('MA presentation route', () => {
  it('is canonical, uncached, and unavailable to crawlers', () => {
    expect(revalidate).toBe(0)
    expect(metadata).toEqual(expect.objectContaining({
      title: 'Increasing ARPDAU - Presentation by Eliahu Cohen',
      description: 'A 17-slide product presentation for the Moon Active PM home assignment.',
      alternates: { canonical: 'https://eliahu.co/MA-HomeAssignment/presentation/' },
      robots: expect.objectContaining({ index: false, follow: false, nocache: true }),
    }))
  })
})
