/**
 * Copies the TEAMKPN prototype's taxonomy into this editor (src/data/teamkpn/), so the publishing
 * targeting, the block-version targeting and the preview all use exactly the channels, doelgroepen
 * and feeds the TEAMKPN prototype knows. The copies are committed (the editor's own Netlify build
 * doesn't have the other repo) — re-run after the taxonomy changes there:
 *
 *   node scripts/sync-teamkpn-data.mjs [path/to/teamkpn-voor-jou]
 */
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = resolve(process.argv[2] || join(here, '../../Channel Personalisatie - TEAMKPN voor jou/teamkpn-voor-jou'))
const target = join(here, '../src/data/teamkpn')
mkdirSync(target, { recursive: true })
for (const f of ['taxonomy.json', 'feeds.json']) {
  copyFileSync(join(source, 'src/data', f), join(target, f))
  console.log(`✓ ${f}`)
}
