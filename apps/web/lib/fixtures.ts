import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Deterministic server-side data for visual regression tests.
 *
 * - `NOTION_FIXTURES=record` calls through and stores every result.
 * - `NOTION_FIXTURES=replay` serves stored results and never hits the network.
 * - unset: no-op.
 */
export const fixturesMode = process.env.NOTION_FIXTURES as
  | 'record'
  | 'replay'
  | undefined

const fixturesDir =
  process.env.NOTION_FIXTURES_DIR ||
  path.join(process.cwd(), 'e2e', 'fixtures', 'server')

export async function withFixture<T>(
  namespace: string,
  key: unknown,
  fn: () => Promise<T>
): Promise<T> {
  if (!fixturesMode) {
    return fn()
  }

  const hash = createHash('sha1').update(JSON.stringify(key)).digest('hex')
  const file = path.join(fixturesDir, namespace, `${hash}.json`)

  if (fixturesMode === 'replay') {
    try {
      return JSON.parse(await readFile(file, 'utf8')) as T
    } catch {
      throw new Error(
        `Missing ${namespace} fixture for ${JSON.stringify(key)} (${file}); re-record with NOTION_FIXTURES=record`
      )
    }
  }

  const result = await fn()
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, JSON.stringify(result))
  return result
}
