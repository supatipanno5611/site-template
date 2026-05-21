'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { safeDecodeURIComponent } from '@/lib/safe-decode'
import { uiText } from '@/lib/ui-text'
import LocalHeader from '@/app/components/LocalHeader'
import PeoplePicker from '@/app/components/PeoplePicker'
import { useHideOnScroll } from '@/app/components/useHideOnScroll'
import { useSearchShortcut } from '@/app/components/hooks/useSearchShortcut'
import fabStyles from '@/app/components/Fab.module.css'
import { SearchIcon, XIcon } from '@/app/components/icons'
import searchFabStyles from '@/app/components/Search.module.css'
import styles from './page.module.css'

type PersonInfo = { name: string; count: number }
type PersonRole = { name: string; role: string }

type PostSummary = {
  slugAsParams: string
  title: string
  roles: PersonRole[]
}

type Props = {
  person: string | null
  posts: PostSummary[]
  allPeople: PersonInfo[]
}

const PEOPLE_PAGE_SIZE = 30

export default function PeopleClient({ person, posts, allPeople }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const extraPeople = Array.from(new Set(
    searchParams.get('with')
      ?.split(',')
      .map(safeDecodeURIComponent)
      .filter((value): value is string => Boolean(value)) ?? []
  ))
  const selected = Array.from(new Set(person ? [person, ...extraPeople] : extraPeople))
  const selectedKey = selected.join(',')

  const [pickerOpen, setPickerOpen] = useState(false)
  const [visibleState, setVisibleState] = useState({ key: selectedKey, count: 30 })
  const [visiblePeopleCount, setVisiblePeopleCount] = useState(PEOPLE_PAGE_SIZE)
  const visibleCount = visibleState.key === selectedKey ? visibleState.count : 30
  const pickerVisible = useHideOnScroll()

  useSearchShortcut(useCallback(() => setPickerOpen(true), []))

  function buildUrl(newSelected: string[]): string {
    const [main, ...extras] = newSelected
    if (!main) return '/people'
    const qs = extras.length ? `?with=${extras.map(encodeURIComponent).join(',')}` : ''
    return `/people/${encodeURIComponent(main)}${qs}`
  }

  function addPerson(name: string) {
    router.push(buildUrl([...selected, name]))
  }

  function removePerson(name: string) {
    router.push(buildUrl(selected.filter((s) => s !== name)))
  }

  function handleSingleSelect(name: string) {
    if (selected.includes(name)) removePerson(name)
    else addPerson(name)
    setPickerOpen(false)
  }

  function handleToggleSelect(name: string) {
    if (selected.includes(name)) removePerson(name)
    else addPerson(name)
  }

  const visiblePeople = allPeople.slice(0, visiblePeopleCount)
  const hasMorePeople = allPeople.length > visiblePeopleCount

  return (
    <main className={styles.main}>
      <LocalHeader title={uiText.people.title} />
      <button
        className={`${fabStyles.fab} ${searchFabStyles.search} ${pickerVisible ? '' : fabStyles.fabHidden}`}
        onClick={() => setPickerOpen(true)}
        aria-label={uiText.people.openSearch}
        title={uiText.people.openSearchWithShortcut}
      >
        <SearchIcon aria-hidden />
      </button>

      <PeoplePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        allPeople={allPeople}
        selected={selected}
        onSingleSelect={handleSingleSelect}
        onToggleSelect={handleToggleSelect}
      />

      {selected.length > 0 && (
        <div className={styles.header}>
          <div className={styles.chips}>
            {selected.map((name, i) => (
              <span key={name} className={`${styles.chip} ${i === 0 ? styles.chipMain : styles.chipExtra}`}>
                {name}
                <button className={styles.chipRemove} onClick={() => removePerson(name)} aria-label={uiText.people.removeLabel(name)}>
                  <XIcon aria-hidden />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {selected.length === 0 && allPeople.length > 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyHint}>{uiText.people.browse}</p>
          <div className={styles.recommendList}>
            {visiblePeople.map((info) => (
              <button key={info.name} className={styles.recommendChip} onClick={() => addPerson(info.name)}>
                {info.name}
                <span className={styles.recommendCount}>{uiText.common.postCount(info.count)}</span>
              </button>
            ))}
          </div>
          {hasMorePeople && (
            <button className={styles.moreBtn} onClick={() => setVisiblePeopleCount(visiblePeopleCount + PEOPLE_PAGE_SIZE)}>
              {uiText.common.more}
            </button>
          )}
        </div>
      )}

      {selected.length === 0 && allPeople.length === 0 && <p className={styles.emptyHint}>{uiText.people.emptyBrowse}</p>}

      {selected.length > 0 && posts.length === 0 && (
        <p className={styles.empty}>
          {uiText.people.emptyCombination}{' '}
          <button className={styles.resetBtn} onClick={() => router.push('/people')}>
            {uiText.people.resetSearch}
          </button>
        </p>
      )}

      {selected.length > 0 && posts.length > 0 && (
        <>
          <p className={styles.count}>{uiText.common.postCount(posts.length)}</p>
          <ul className={styles.list}>
            {posts.slice(0, visibleCount).map((post) => (
              <li key={post.slugAsParams}>
                <a href={`/${post.slugAsParams}`} className={styles.item}>
                  <span className={styles.title}>{post.title}</span>
                  {post.roles.length > 0 && (
                    <span className={styles.roles}>
                      {post.roles.map((role) => (
                        <span key={`${role.name}-${role.role}`} className={styles.role}>
                          {role.name} · {role.role}
                        </span>
                      ))}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
          {posts.length > visibleCount && (
            <button
              className={styles.moreBtn}
              onClick={() => setVisibleState({ key: selectedKey, count: visibleCount + 30 })}
            >
              {uiText.common.more}
            </button>
          )}
        </>
      )}
    </main>
  )
}
