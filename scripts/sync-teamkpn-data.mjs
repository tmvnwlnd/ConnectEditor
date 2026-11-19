/**
 * Copies the TEAMKPN prototype's taxonomy into this editor (src/data/teamkpn/), so the publishing
 * targeting, the block-version targeting and the preview all use exactly the channels, doelgroepen
 * and feeds the TEAMKPN prototype knows. The copies are committed (the editor's own Netlify build
 * doesn't have the other repo) — re-run after the taxonomy changes there:
 *
 *   node scripts/sync-teamkpn-data.mjs [path/to/teamkpn-voor-jou]
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = resolve(process.argv[2] || join(here, '../../Channel Personalisatie - TEAMKPN voor jou/teamkpn-voor-jou'))
const target = join(here, '../src/data/teamkpn')
mkdirSync(target, { recursive: true })
for (const f of ['taxonomy.json', 'feeds.json', 'contacts.json']) {
  copyFileSync(join(source, 'src/data', f), join(target, f))
  console.log(`✓ ${f}`)
}

// Article list (id, title, date) only — for picking related articles ("Bekijk ook", SoW B3).
const { articles } = JSON.parse(readFileSync(join(source, 'src/data/articles.json'), 'utf8'))
const index = articles.map(({ id, title, publishDate }) => ({ id, title, publishDate }))
writeFileSync(join(target, 'articles-index.json'), JSON.stringify(index, null, 2) + '\n')
console.log(`✓ articles-index.json (${index.length})`)

