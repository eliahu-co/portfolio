import type { MetadataRoute } from 'next'

// Generates /robots.txt. The interview-deliverable pages are kept out of search
// engines AND AI/LLM crawlers; the rest of the portfolio stays fully crawlable.
const HIDDEN = ['/MA-HomeAssignment', '/HA-DrawingAnalyzer']

// Known search + AI/LLM crawler user-agents to keep off the hidden pages.
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'CCBot',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot-Extended',
  'Bytespider',
  'Amazonbot',
  'cohere-ai',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'Diffbot',
  'Omgilibot',
  'ImagesiftBot',
  'YouBot',
  'Timpibot',
  'DuckAssistBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: HIDDEN },
      { userAgent: AI_BOTS, disallow: HIDDEN },
    ],
  }
}
