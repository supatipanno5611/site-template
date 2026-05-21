import { posts } from '#site/content'
import { isHomeLinkPagePath } from '@/lib/home-link-pages'
import { getPostPeople } from '@/lib/people'
import { siteConfig } from '@/site.config'

export type SearchDoc = {
  id: string
  title: string
  url: string
  body: string
  topics: string
  audioTitle: string
  tags: string[]
  people: string[]
}

export function getSearchDocs(): SearchDoc[] {
  return posts
    .filter((p) => !p.draft && p.slugAsParams !== siteConfig.homeSlug && !isHomeLinkPagePath(p.slug))
    .map((p) => {
      const audioTitle = p.audioTitle ?? ''
      return {
        id: p.slugAsParams,
        title: p.title,
        url: `/${p.slugAsParams}`,
        body: p.plainText,
        topics: p.topics.join(' '),
        audioTitle,
        tags: p.topics,
        people: getPostPeople(p),
      }
    })
}
