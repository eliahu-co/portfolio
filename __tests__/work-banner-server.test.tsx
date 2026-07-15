import { readdirSync, readFileSync } from 'fs'
import WorkBannerServer from '@/components/WorkBannerServer'

jest.mock('fs', () => ({
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  openSync: jest.fn(),
  readSync: jest.fn(),
  closeSync: jest.fn(),
}))

const videoEntry = (name: string) => ({
  name,
  isDirectory: () => false,
  isFile: () => true,
})

describe('WorkBannerServer product ordering', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Math, 'random').mockReturnValue(0)
    ;(readFileSync as jest.Mock).mockReturnValue('{}')
    ;(readdirSync as jest.Mock).mockImplementation((dir: string) =>
      dir.endsWith('product')
        ? [
            videoEntry('40-studio.mp4'),
            videoEntry('10-test44.mp4'),
            videoEntry('30-fastener.mp4'),
            videoEntry('20-drawinganalyzer.mp4'),
          ]
        : []
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('orders Product & Dev videos by their leading filename number', () => {
    const element = WorkBannerServer()
    const sources = element.props.sets.product.map(
      (slot: { a: { src: string } }) => slot.a.src
    )

    expect(sources).toEqual([
      '/product/10-test44.mp4',
      '/product/20-drawinganalyzer.mp4',
      '/product/30-fastener.mp4',
      '/product/40-studio.mp4',
    ])
  })
})
