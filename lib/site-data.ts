// lib/site-data.ts

export interface ContactLink {
  label:      string
  href:       string
  external:   boolean
  download:   boolean
  mobileOnly?: boolean
}

export const CONTACT_LINKS: ContactLink[] = [
  { label: 'Call ↗',        href: 'tel:+972528901495',                                  external: false, download: false, mobileOnly: true },
  { label: 'hi@eliahu.co',   href: 'mailto:hi@eliahu.co',                                external: false, download: false },
  { label: 'GitHub ↗',       href: 'https://github.com/eliahu-co/',                      external: true,  download: false },
  { label: 'LinkedIn ↗',     href: 'https://www.linkedin.com/in/eliahu-cohen-b32374114', external: true,  download: false },
  { label: 'Download CV ↓',  href: '/cv.pdf',                                            external: false, download: true  },
]

export interface NavLink {
  label: string
  href:  string
  id:    string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home',      href: '#hero',     id: 'hero'     },
  { label: 'About',     href: '#about',    id: 'about'    },
  { label: 'What I Do', href: '#what-i-do', id: 'what-i-do' },
]
