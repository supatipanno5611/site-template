'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { highlight } from '@/lib/highlight'
import { topicIncludesQuery } from '@/lib/topic-match'
import { uiText } from '@/lib/ui-text'
import searchStyles from './SearchBox.module.css'
import { BackIcon, CheckIcon, SearchIcon, XIcon } from './icons'
import styles from './TopicPicker.module.css'

type PersonInfo = { name: string; count: number }

const noopSubscribe = () => () => {}

type Props = {
  open: boolean
  onClose: () => void
  allPeople: PersonInfo[]
  selected: string[]
  onSingleSelect: (person: string) => void
  onToggleSelect: (person: string) => void
}

export default function PeoplePicker({
  open,
  onClose,
  allPeople,
  selected,
  onSingleSelect,
  onToggleSelect,
}: Props) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const activeItemRef = useRef<HTMLLIElement | null>(null)
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)

  const filtered = allPeople.filter((person) => topicIncludesQuery(person.name, query))
  const listLength = filtered.length

  const close = () => {
    setQuery('')
    setActiveIndex(0)
    onClose()
  }

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  useEffect(() => {
    if (!open) return

    inputRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, listLength - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const person = filtered[activeIndex]
      if (!person) return
      if (e.ctrlKey) {
        onToggleSelect(person.name)
        setQuery('')
        setActiveIndex(0)
      } else {
        setQuery('')
        setActiveIndex(0)
        onSingleSelect(person.name)
      }
    } else if (e.key === 'Backspace' && query === '' && selected.length > 0) {
      e.preventDefault()
      onToggleSelect(selected[selected.length - 1])
    } else if (e.key === 'Escape') {
      close()
    }
  }

  if (!open) return null

  return (
    <>
      {mounted && createPortal(<div className={searchStyles.overlayBackdrop} onClick={close} />, document.body)}
      <div className={`${searchStyles.container} ${searchStyles.overlayContainer}`} role="dialog" aria-modal="true" aria-label={uiText.people.searchDialog}>
        <div className={searchStyles.inputWrap}>
          <button className={searchStyles.backButton} onClick={close} aria-label={uiText.people.closeSearch}>
            <BackIcon aria-hidden />
          </button>
          <div className={searchStyles.inputField}>
            <SearchIcon className={searchStyles.icon} aria-hidden />
            <input
              ref={inputRef}
              className={searchStyles.input}
              type="text"
              placeholder={uiText.people.placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
              aria-autocomplete="list"
            />
            {query && (
              <button
                className={searchStyles.clear}
                onClick={() => {
                  setQuery('')
                  setActiveIndex(0)
                  inputRef.current?.focus()
                }}
                aria-label={uiText.people.clear}
              >
                <XIcon aria-hidden />
              </button>
            )}
          </div>
        </div>
        <div className={`${searchStyles.dropdown} ${searchStyles.overlayDropdown}`} onMouseDown={(e) => e.preventDefault()}>
          <ul className={searchStyles.results} role="listbox">
            {filtered.map((person, i) => {
              const isActive = i === activeIndex
              const isSelected = selected.includes(person.name)
              return (
                <li
                  key={person.name}
                  ref={isActive ? activeItemRef : null}
                  className={`${isActive ? styles.activeRow : ''} ${isSelected ? styles.rowSelected : ''}`}
                  role="option"
                  aria-selected={isActive}
                  aria-checked={isSelected}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <button className={styles.topicRow} onClick={() => onToggleSelect(person.name)}>
                    <span className={searchStyles.title}>{highlight(person.name, query, searchStyles.mark)}</span>
                    <span className={styles.meta}>
                      {isSelected && <CheckIcon className={styles.checkIcon} aria-hidden />}
                      <span className={searchStyles.topicCount}>{uiText.common.postCount(person.count)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className={searchStyles.hint}>
            <span>{uiText.search.hints.move}</span>
            <span>{uiText.search.hints.select}</span>
            <span>{uiText.search.hints.multiSelect}</span>
            <span>{uiText.search.hints.close}</span>
          </div>
        </div>
      </div>
    </>
  )
}
