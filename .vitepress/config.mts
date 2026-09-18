import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// GITHUB_REPOSITORY is "owner/name" in Actions. Deriving both the base path and
// the repository links from it means renaming the repo cannot silently break the
// published asset URLs; the fallbacks are only used for local development.
const slug = process.env.GITHUB_REPOSITORY || 'kamil-kielbasa/ai-infrastructure-book'
const name = slug.split('/')[1]
const repoUrl = `https://github.com/${slug}`

// withMermaid() wraps the config so ```mermaid fences render as diagrams
// instead of code blocks.
export default withMermaid(defineConfig({
  title: 'Running Models Yourself',
  description: 'A field guide to running language models on your own hardware',

  // GitHub Pages serves a project site under /<repo>/. DOCS_BASE overrides this
  // if the book ever moves to a custom domain.
  base: process.env.DOCS_BASE || `/${name}/`,

  lastUpdated: true,
  cleanUrls: true,

  // README.md is for people browsing the repo on GitHub; index.md is the site
  // landing page. Without this the README would also be published, as /README.
  srcExclude: ['README.md'],

  // Chapters 2, 4, 5, 8 and 11 derive memory and throughput formulas.
  markdown: { math: true },

  themeConfig: {
    nav: [
      { text: 'Read the book', link: '/book/01-what-a-model-is' },
      { text: 'Contributing', link: '/contributing' }
    ],

    sidebar: [
      {
        text: 'Part I — Foundations',
        collapsed: false,
        items: [
          { text: '1. What a model actually is', link: '/book/01-what-a-model-is' },
          { text: '2. Size, precision and memory', link: '/book/02-size-and-memory' },
          { text: '3. Dense models and sparse ones', link: '/book/03-dense-and-sparse' },
          { text: '4. The graphics card', link: '/book/04-the-gpu' }
        ]
      },
      {
        text: 'Part II — Getting hands on',
        collapsed: false,
        items: [
          { text: '5. The reference machine', link: '/book/05-the-reference-machine' },
          { text: '6. The first run', link: '/book/06-the-first-run' },
          { text: '7. Reading a model name', link: '/book/07-reading-model-names' }
        ]
      },
      {
        text: 'Part III — The landscape',
        collapsed: false,
        items: [
          { text: '8. Every model, and what it costs to run', link: '/book/08-the-model-landscape' },
          { text: '9. Coding and editors', link: '/book/09-coding-and-editors' }
        ]
      },
      {
        text: 'Part IV — Building infrastructure',
        collapsed: false,
        items: [
          { text: '10. From one user to many', link: '/book/10-from-one-user-to-many' },
          { text: '11. Reference architectures', link: '/book/11-reference-architectures' }
        ]
      },
      {
        text: 'Part V — Going further',
        collapsed: false,
        items: [
          { text: '12. Teaching a model your data', link: '/book/12-your-own-data' },
          { text: '13. Security', link: '/book/13-security' },
          { text: '14. Hardware beyond this book', link: '/book/14-going-further' },
          { text: '15. Closing', link: '/book/15-closing' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: repoUrl }
    ],

    editLink: {
      pattern: `${repoUrl}/edit/main/:path`,
      text: 'Suggest a change to this page'
    },

    search: { provider: 'local' },

    docFooter: { prev: 'Previous chapter', next: 'Next chapter' },

    footer: {
      message: 'Drafted by a language model, reviewed by a human — verify any number before you spend money on it.',
      copyright: 'MIT licensed. Corrections welcome.'
    }
  }
}))
