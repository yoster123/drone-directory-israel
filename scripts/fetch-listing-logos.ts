/**
 * Automated logo discovery for ALTIV listings.
 * For each listing with a website, fetches the homepage, extracts logo candidates
 * in priority order, downloads the best one, and updates logo-overrides.json.
 *
 * Priority order:
 *  1. JSON-LD Organization.logo (high confidence)
 *  2. <link rel="apple-touch-icon"> (high confidence)
 *  3. <link rel="icon"> / <link rel="shortcut icon"> (medium confidence)
 *  4. /favicon.ico (low confidence)
 *  5. og:image only if URL contains "logo" or "icon" (medium confidence)
 *
 * Usage: npm run fetch:logos
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import { URL } from 'url'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LogoOverride {
  logoUrl: string
  logoSource: 'official-site' | 'favicon' | 'manual' | 'claimed-profile' | 'generated'
  logoConfidence?: 'high' | 'medium' | 'low'
}

interface LogoCandidate {
  url: string
  source: LogoOverride['logoSource']
  confidence: 'high' | 'medium' | 'low'
}

interface ListingStub {
  id: string
  slug: string
  name: string
  website: string | null
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '..')
const LOGOS_DIR = path.join(ROOT, 'public', 'listing-logos')
const OVERRIDES_PATH = path.join(ROOT, 'data-import', 'logo-overrides.json')
const LISTINGS_PATH = path.join(ROOT, 'src', 'data', 'enriched-listings.ts')
const DELAY_MS = 600
const FETCH_TIMEOUT_MS = 10_000
const MIN_BYTES = 100
const MAX_BYTES = 500 * 1024
const MIN_DIMENSION = 16 // skip PNGs smaller than 16×16

// ---------------------------------------------------------------------------
// Helpers — HTTP
// ---------------------------------------------------------------------------

function fetchUrl(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<{ body: Buffer; contentType: string; finalUrl: string }> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url)
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ALTIVbot/1.0; logo-discovery)',
        Accept: 'text/html,application/xhtml+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8',
      },
    }

    let redirectCount = 0

    function doRequest(reqUrl: string) {
      const parsed = new URL(reqUrl)
      const reqLib = parsed.protocol === 'https:' ? https : http
      const reqOptions = {
        ...options,
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      }

      const req = reqLib.get(reqOptions, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          if (redirectCount++ > 5) return reject(new Error('Too many redirects'))
          const next = new URL(res.headers.location, reqUrl).toString()
          res.resume()
          doRequest(next)
          return
        }

        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 400) {
          res.resume()
          return reject(new Error(`HTTP ${res.statusCode} for ${reqUrl}`))
        }

        const chunks: Buffer[] = []
        res.on('data', (chunk: Buffer) => chunks.push(chunk))
        res.on('end', () => resolve({
          body: Buffer.concat(chunks),
          contentType: res.headers['content-type'] ?? '',
          finalUrl: reqUrl,
        }))
        res.on('error', reject)
      })

      req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error(`Timeout fetching ${reqUrl}`)) })
      req.on('error', reject)
    }

    doRequest(url)
  })
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

// ---------------------------------------------------------------------------
// Helpers — HTML parsing (no external deps)
// ---------------------------------------------------------------------------

function extractHead(html: string): string {
  const headEnd = html.toLowerCase().indexOf('</head>')
  return headEnd === -1 ? html.slice(0, 8000) : html.slice(0, headEnd + 7)
}

function getAttr(tag: string, attr: string): string | null {
  const re = new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, 'i')
  const m = tag.match(re)
  return m ? m[1] : null
}

function resolveUrl(candidate: string, base: string): string | null {
  try {
    return new URL(candidate, base).toString()
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Logo candidate extraction
// ---------------------------------------------------------------------------

function extractCandidates(html: string, pageUrl: string, origin: string): LogoCandidate[] {
  const head = extractHead(html)
  const candidates: LogoCandidate[] = []

  // 1. JSON-LD Organization.logo
  const jsonLdBlocks = [...head.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  for (const block of jsonLdBlocks) {
    try {
      const data = JSON.parse(block[1])
      const entries = Array.isArray(data) ? data : [data]
      for (const entry of entries) {
        if (entry['@type'] === 'Organization' || entry['@type'] === 'LocalBusiness') {
          const logo = entry.logo
          if (logo) {
            const logoUrl = typeof logo === 'string' ? logo : (logo.url ?? null)
            if (logoUrl) {
              const resolved = resolveUrl(logoUrl, pageUrl)
              if (resolved) candidates.push({ url: resolved, source: 'official-site', confidence: 'high' })
            }
          }
        }
      }
    } catch { /* invalid JSON-LD */ }
  }

  // 2. apple-touch-icon
  const touchIcons = [...head.matchAll(/<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]*>/gi)]
  for (const tag of touchIcons) {
    const href = getAttr(tag[0], 'href')
    if (href) {
      const resolved = resolveUrl(href, pageUrl)
      if (resolved) candidates.push({ url: resolved, source: 'favicon', confidence: 'high' })
    }
  }

  // 3. link rel=icon / shortcut icon
  const iconLinks = [...head.matchAll(/<link[^>]+rel=["'][^"']*(?:shortcut )?icon[^"']*["'][^>]*>/gi)]
  for (const tag of iconLinks) {
    const href = getAttr(tag[0], 'href')
    if (href && !href.startsWith('data:')) {
      const resolved = resolveUrl(href, pageUrl)
      if (resolved) candidates.push({ url: resolved, source: 'favicon', confidence: 'medium' })
    }
  }

  // 4. og:image if logo-like
  const ogImages = [...head.matchAll(/<meta[^>]+property=["']og:image["'][^>]*>/gi)]
  for (const tag of ogImages) {
    const content = getAttr(tag[0], 'content')
    if (content) {
      const lower = content.toLowerCase()
      if (lower.includes('logo') || lower.includes('icon')) {
        const resolved = resolveUrl(content, pageUrl)
        if (resolved) candidates.push({ url: resolved, source: 'official-site', confidence: 'medium' })
      }
    }
  }

  // 5. /favicon.ico fallback
  candidates.push({ url: `${origin}/favicon.ico`, source: 'favicon', confidence: 'low' })

  return candidates
}

// ---------------------------------------------------------------------------
// Image validation
// ---------------------------------------------------------------------------

function extFromContentType(ct: string): string | null {
  if (ct.includes('png')) return 'png'
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg'
  if (ct.includes('webp')) return 'webp'
  if (ct.includes('svg')) return 'svg'
  if (ct.includes('x-icon') || ct.includes('vnd.microsoft.icon')) return 'ico'
  if (ct.includes('gif')) return null // skip GIFs
  return null
}

function extFromUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname.toLowerCase()
    const m = pathname.match(/\.(png|jpg|jpeg|webp|svg|ico)$/)
    if (!m) return null
    if (m[1] === 'jpeg') return 'jpg'
    return m[1]
  } catch {
    return null
  }
}

function readPngDimensions(buf: Buffer): { w: number; h: number } | null {
  // PNG signature: 8 bytes, then IHDR chunk (4 len + 4 "IHDR" + 4 width + 4 height)
  if (buf.length < 24) return null
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) return null
  const w = buf.readUInt32BE(16)
  const h = buf.readUInt32BE(20)
  return { w, h }
}

interface ValidationResult {
  ok: boolean
  ext?: string
  reason?: string
}

function validateImage(body: Buffer, contentType: string, url: string): ValidationResult {
  if (body.length < MIN_BYTES) return { ok: false, reason: `too small (${body.length}B)` }
  if (body.length > MAX_BYTES) return { ok: false, reason: `too large (${body.length}B)` }

  const ext = extFromContentType(contentType) ?? extFromUrl(url)
  if (!ext) return { ok: false, reason: `unsupported content-type "${contentType}"` }
  if (ext === null) return { ok: false, reason: 'GIF skipped' }

  if (ext === 'png') {
    const dims = readPngDimensions(body)
    if (dims && (dims.w < MIN_DIMENSION || dims.h < MIN_DIMENSION)) {
      return { ok: false, reason: `PNG too small (${dims.w}×${dims.h})` }
    }
  }

  // ICO files: skip if tiny (likely 16×16 only)
  if (ext === 'ico' && body.length < 500) {
    return { ok: false, reason: `ICO too small (${body.length}B, likely 16px only)` }
  }

  return { ok: true, ext }
}

// ---------------------------------------------------------------------------
// Load listings
// ---------------------------------------------------------------------------

function loadListings(): ListingStub[] {
  const src = fs.readFileSync(LISTINGS_PATH, 'utf-8')
  const listings: ListingStub[] = []
  // Parse id, slug, name, website from the TypeScript literal — crude but no parser needed
  const blocks = src.split(/(?=\s*\{[\s\S]*?"id"\s*:)/)
  for (const block of blocks) {
    const idM = block.match(/"id"\s*:\s*"([^"]+)"/)
    const slugM = block.match(/"slug"\s*:\s*"([^"]+)"/)
    const nameM = block.match(/"name"\s*:\s*"([^"]+)"/)
    const webM = block.match(/"website"\s*:\s*"([^"]+)"/)
    if (idM && slugM && nameM) {
      listings.push({
        id: idM[1],
        slug: slugM[1],
        name: nameM[1],
        website: webM ? webM[1] : null,
      })
    }
  }
  return listings
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  fs.mkdirSync(LOGOS_DIR, { recursive: true })

  const overrides: Record<string, LogoOverride> = (() => {
    try { return JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf-8')) } catch { return {} }
  })()

  const listings = loadListings()
  const withWebsite = listings.filter(l => l.website)
  console.log(`\nListings total: ${listings.length} | with website: ${withWebsite.length}\n`)

  const stats = { skipped: 0, accepted: 0, failed: 0 }
  const acceptedLog: string[] = []
  const skipLog: string[] = []

  for (const listing of withWebsite) {
    const website = listing.website!

    // Already have an override for this listing
    if (overrides[listing.id]) {
      skipLog.push(`${listing.id} ${listing.name}: already has override`)
      stats.skipped++
      continue
    }

    // Already have a logo file on disk
    const existingFile = fs.readdirSync(LOGOS_DIR).find(f => f.startsWith(listing.slug + '.'))
    if (existingFile) {
      skipLog.push(`${listing.id} ${listing.name}: file already exists (${existingFile})`)
      stats.skipped++
      continue
    }

    let origin: string
    try {
      const parsed = new URL(website)
      origin = `${parsed.protocol}//${parsed.hostname}`
    } catch {
      skipLog.push(`${listing.id} ${listing.name}: invalid URL "${website}"`)
      stats.skipped++
      continue
    }

    // Polite delay
    await sleep(DELAY_MS)

    console.log(`Fetching homepage: ${listing.name} (${origin})`)

    let html: string
    try {
      const { body } = await fetchUrl(origin)
      html = body.toString('utf-8')
    } catch (err) {
      skipLog.push(`${listing.id} ${listing.name}: homepage fetch failed — ${(err as Error).message}`)
      stats.failed++
      continue
    }

    const candidates = extractCandidates(html, origin, origin)
    let accepted = false

    for (const candidate of candidates) {
      if (accepted) break

      // Skip clearly non-logo og:images or external CDN favicon for known platforms
      const candidateLower = candidate.url.toLowerCase()
      if (candidateLower.includes('google.com/favicon') || candidateLower.includes('gstatic.com')) {
        continue
      }

      console.log(`  Trying [${candidate.source}/${candidate.confidence}]: ${candidate.url}`)

      let imgBody: Buffer
      let imgContentType: string
      try {
        const result = await fetchUrl(candidate.url, 8000)
        imgBody = result.body
        imgContentType = result.contentType
      } catch (err) {
        console.log(`    -> fetch failed: ${(err as Error).message}`)
        continue
      }

      const validation = validateImage(imgBody, imgContentType, candidate.url)
      if (!validation.ok) {
        console.log(`    -> rejected: ${validation.reason}`)
        continue
      }

      const ext = validation.ext!
      const filename = `${listing.slug}.${ext}`
      const destPath = path.join(LOGOS_DIR, filename)
      const publicPath = `/listing-logos/${filename}`

      fs.writeFileSync(destPath, imgBody)

      overrides[listing.id] = {
        logoUrl: publicPath,
        logoSource: candidate.source,
        logoConfidence: candidate.confidence,
      }

      // Flush overrides to disk after each accepted logo (incremental)
      fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(overrides, null, 2))

      console.log(`    -> ACCEPTED: ${publicPath} (${imgBody.length}B, ${ext})`)
      acceptedLog.push(`${listing.id} ${listing.name}: ${publicPath} [${candidate.source}/${candidate.confidence}]`)
      stats.accepted++
      accepted = true
    }

    if (!accepted) {
      skipLog.push(`${listing.id} ${listing.name}: no valid logo found`)
      stats.failed++
    }
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60))
  console.log('LOGO DISCOVERY SUMMARY')
  console.log('='.repeat(60))
  console.log(`Listings with website:  ${withWebsite.length}`)
  console.log(`Already had override:   ${skipLog.filter(l => l.includes('already has override') || l.includes('already exists')).length}`)
  console.log(`Accepted:               ${stats.accepted}`)
  console.log(`Failed/not found:       ${stats.failed}`)
  console.log(`Skipped:                ${stats.skipped}`)

  if (acceptedLog.length) {
    console.log('\nACCEPTED:')
    acceptedLog.forEach(l => console.log('  + ' + l))
  }

  if (skipLog.length) {
    console.log('\nSKIPPED/FAILED:')
    skipLog.forEach(l => console.log('  - ' + l))
  }

  console.log('\nDone.')
}

main().catch(e => { console.error(e); process.exit(1) })
