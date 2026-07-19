import WorkBannerSwitcher from './WorkBannerSwitcher'
import type { ImageSlot } from './WorkBanner'
import manifest from './workBannerManifest.json'

export default function WorkBannerServer() {
  return <WorkBannerSwitcher sets={manifest as Record<string, ImageSlot[]>} />
}
