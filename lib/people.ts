import { posts } from '#site/content'
import { isHomeLinkPagePath } from '@/lib/home-link-pages'
import { siteConfig } from '@/site.config'
import { uiText } from './ui-text'

function visiblePosts() {
  return posts.filter((p) => !p.draft && p.slugAsParams !== siteConfig.homeSlug && !isHomeLinkPagePath(p.slug))
}

export type PersonInfo = { name: string; count: number }

export type PersonRole = {
  name: string
  role: string
}

export function getPostPeople(post: {
  teacher: string[]
  translator: string[]
  writer: string[]
  questioner: string[]
}): string[] {
  return Array.from(new Set([
    ...post.teacher,
    ...post.translator,
    ...post.writer,
    ...post.questioner,
  ]))
}

export function getPersonRoles(
  post: {
    teacher: string[]
    translator: string[]
    writer: string[]
    questioner: string[]
  },
  selected: string[]
): PersonRole[] {
  const rows = [
    { role: uiText.postFooter.teacher, values: post.teacher },
    { role: uiText.postFooter.translator, values: post.translator },
    { role: uiText.postFooter.writer, values: post.writer },
    { role: uiText.postFooter.questioner, values: post.questioner },
  ]

  return rows.flatMap(({ role, values }) =>
    values.filter((name) => selected.includes(name)).map((name) => ({ name, role }))
  )
}

export function getAllPeople(): PersonInfo[] {
  const counts = new Map<string, number>()
  for (const post of visiblePosts()) {
    for (const person of getPostPeople(post)) {
      counts.set(person, (counts.get(person) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function getPostsByPeople(people: string[]) {
  const selected = Array.from(new Set(people))
  return visiblePosts()
    .filter((p) => {
      const postPeople = getPostPeople(p)
      return selected.every((person) => postPeople.includes(person))
    })
    .map((p) => ({
      slugAsParams: p.slugAsParams as string,
      title: p.title as string,
      roles: getPersonRoles(p, selected),
    }))
}
