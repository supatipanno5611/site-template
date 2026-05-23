type ParentPost = {
  draft: boolean
  slug: string
  slugAsParams: string
  title: string
  type?: 'index'
  parent?: string
}

export type ParentTocLink = {
  slugAsParams: string
  title: string
}

export type ParentToc = {
  index: ParentTocLink
  items: ParentTocLink[]
}

export function getParentToc(current: ParentPost, posts: ParentPost[]): ParentToc | null {
  if (!current.parent || current.type === 'index') return null

  const index = posts.find((post) => !post.draft && post.slugAsParams === current.parent && post.type === 'index')
  if (!index) return null

  const items = posts
    .filter((post) => !post.draft && post.type !== 'index' && post.parent === current.parent)
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((post) => ({
      slugAsParams: post.slugAsParams,
      title: post.title,
    }))

  return {
    index: {
      slugAsParams: index.slugAsParams,
      title: index.title,
    },
    items,
  }
}
