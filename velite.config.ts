import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { cwd } from 'node:process'
import { defineConfig, defineCollection, s } from 'velite'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { VFile } from 'vfile'
import { remarkPlainText } from './lib/remark-plain-text'
import { remarkMark } from './lib/remark-mark'
import { remarkCallout } from './lib/remark-callout'
import { remarkWikiLink } from './lib/remark-wiki-link'
import { remarkCue } from './lib/remark-cue'
import { remarkChapter } from './lib/remark-chapter'
import { isSafeAudioSrc, YOUTUBE_ID_RE } from './lib/markdown-security'
import { rejectMdxSyntax, remarkMarkdownOnly } from './lib/remark-markdown-only'
import { extractWikiLinks } from './lib/wiki-link'
import { publicSlugForContentPath, titleForContentPath } from './lib/home-link-pages'

const ROOT = cwd()
const CONTENT_DIR = join(ROOT, 'content')

function stripFencedCode(source: string) {
  return source.replace(/(^|\n)(`{3,}|~{3,})[\s\S]*?\n\2(?=\n|$)/g, '$1')
}

function hasFrontmatterKey(source: string, key: string) {
  const open = source.match(/^---\r?\n/)
  if (!open) return false
  const closeRe = /\r?\n---(?:\r?\n|$)/g
  closeRe.lastIndex = open[0].length
  const close = closeRe.exec(source)
  if (!close) return false
  return new RegExp(`^${key}:\\s*`, 'm').test(source.slice(open[0].length, close.index))
}

function cleanStringList(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean)
}

function listMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  const files: string[] = []

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...listMarkdownFiles(path))
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path)
  }

  return files
}

function parseFrontmatterData(source: string) {
  const open = source.match(/^---\r?\n/)
  if (!open) return {}
  const closeRe = /\r?\n---(?:\r?\n|$)/g
  closeRe.lastIndex = open[0].length
  const close = closeRe.exec(source)
  if (!close) return {}

  const data: Record<string, string> = {}
  const matter = source.slice(open[0].length, close.index)
  for (const line of matter.split(/\r?\n/)) {
    const scalar = line.match(/^([A-Za-z][\w-]*):\s*(.*?)\s*$/)
    if (!scalar) continue
    data[scalar[1]] = scalar[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  return data
}

function validateContentRelationships() {
  const files = listMarkdownFiles(CONTENT_DIR)
  const bySlug = new Map<string, { file: string; type?: string; parent?: string }>()

  for (const file of files) {
    const rel = relative(CONTENT_DIR, file).replace(/\\/g, '/')
    const slug = publicSlugForContentPath(rel)
    const data = parseFrontmatterData(readFileSync(file, 'utf8'))
    if (data.type && data.type !== 'index') throw new Error(`${rel} has unsupported type: ${data.type}`)
    const existing = bySlug.get(slug)
    if (existing) {
      throw new Error(`duplicate slug after normalization: ${existing.file} and ${rel} both map to ${slug}`)
    }
    bySlug.set(slug, { file: rel, type: data.type, parent: data.parent })
  }

  for (const [slug, post] of bySlug) {
    if (post.type === 'index' && post.parent) throw new Error(`${post.file} cannot declare parent because type: index is top-level`)
    if (!post.parent) continue
    const parent = bySlug.get(post.parent)
    if (!parent) throw new Error(`${post.file} references missing parent: ${post.parent}`)
    if (post.parent === slug) throw new Error(`${post.file} cannot reference itself as parent`)
    if (parent.type !== 'index') throw new Error(`${post.file} parent must reference type: index post: ${post.parent}`)
  }
}

validateContentRelationships()

const posts = defineCollection({
  name: 'Post',
  pattern: '**/*.md',
  schema: s.object({
    draft: s.boolean().default(false),
    type: s.enum(['index']).optional(),
    parent: s.string().optional(),
    topics: s.string().array().default([]),
    youtubeId: s.string().optional(),
    audioSrc: s.string().optional(),
    audioTitle: s.string().optional(),
    slug: s.path(),
    body: s.raw(),
    raw: s.raw(),
  }).transform(async ({ raw, ...data }) => {
    const source = raw ?? ''
    const markdownBody = stripFencedCode(source)
    rejectMdxSyntax(source)
    if (hasFrontmatterKey(source, 'media')) throw new Error('media frontmatter is no longer supported')
    if (/::(?:youtube|audio)\b/.test(markdownBody)) throw new Error('media directives are no longer supported')
    if (data.youtubeId && data.audioSrc) throw new Error('youtubeId and audioSrc cannot be used together')
    if (data.youtubeId && !YOUTUBE_ID_RE.test(data.youtubeId)) throw new Error(`Invalid YouTube id: ${data.youtubeId}`)
    if (data.audioSrc && !isSafeAudioSrc(data.audioSrc)) throw new Error(`Invalid audio src: ${data.audioSrc}`)
    if (data.audioSrc && !data.audioTitle?.trim()) throw new Error('audioTitle is required when audioSrc is set')
    if (!data.audioSrc && data.audioTitle !== undefined) throw new Error('audioTitle requires audioSrc')
    const audioTitle = data.audioTitle?.trim()

    const processor = unified()
      .use(remarkParse)
      .use(remarkMarkdownOnly)
      .use(remarkMark)
      .use(remarkCallout)
      .use(remarkWikiLink)
      .use(remarkCue)
      .use(remarkChapter)
      .use(remarkPlainText)
    const tree = processor.parse(source)
    const file = new VFile({ value: source })
    await processor.run(tree, file)
    return {
      ...data,
      title: titleForContentPath(data.slug),
      slugAsParams: publicSlugForContentPath(data.slug),
      plainText: file.data.plainText ?? '',
      topics: cleanStringList(data.topics),
      audioTitle,
      hasAudio: Boolean(data.audioSrc),
      wikiLinks: extractWikiLinks(source).map((link) => link.target),
    }
  }),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
  },
  collections: { posts },
})
