// Post-process recorded HARs so replays are deterministic:
// - drop requests that never completed (status <= 0); replaying them would
//   hang forever, without an entry they are aborted immediately
// - replace animated GIFs with their first frame and pause CSS animations in
//   SVGs, so screenshots don't depend on when the animation is captured
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

const dir = path.join(import.meta.dirname, 'fixtures', 'har')
const pausedStyle = '<style>*{animation-play-state:paused!important}</style>'

for (const file of await readdir(dir)) {
  if (!file.endsWith('.har')) continue

  const harPath = path.join(dir, file)
  const har = JSON.parse(await readFile(harPath, 'utf8'))
  const entries = har.log.entries.filter((entry) => entry.response.status > 0)
  const dropped = har.log.entries.length - entries.length

  let frozen = 0
  for (const { response } of entries) {
    const { content } = response
    if (content.mimeType?.startsWith('image/gif') && content._file) {
      const bodyPath = path.join(dir, content._file)
      const png = await sharp(await readFile(bodyPath))
        .png()
        .toBuffer()
      await writeFile(bodyPath, png)
      content.mimeType = 'image/png'
      content.size = png.length
      for (const header of response.headers) {
        if (header.name.toLowerCase() === 'content-type')
          header.value = 'image/png'
        if (header.name.toLowerCase() === 'content-length')
          header.value = String(png.length)
      }
      frozen++
    } else if (content.mimeType?.startsWith('image/svg') && content._file) {
      const bodyPath = path.join(dir, content._file)
      const svg = await readFile(bodyPath, 'utf8')
      if (/animation|@keyframes/.test(svg) && !svg.includes(pausedStyle)) {
        await writeFile(
          bodyPath,
          svg.replace(/<\/svg>\s*$/, `${pausedStyle}</svg>`)
        )
        frozen++
      }
    }
  }

  if (dropped || frozen) {
    har.log.entries = entries
    await writeFile(harPath, JSON.stringify(har, null, 2))
    console.log(
      `${file}: dropped ${dropped} incomplete, froze ${frozen} animated image(s)`
    )
  }
}
