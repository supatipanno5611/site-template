import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getAllPeople, getPostsByPeople } from '@/lib/people'
import { safeDecodeURIComponent } from '@/lib/safe-decode'
import PeopleClient from '../PeopleClient'

type Props = {
  params: Promise<{ person: string }>
  searchParams: Promise<{ with?: string }>
}

export function generateStaticParams() {
  return getAllPeople().map(({ name }) => ({ person: name }))
}

export default async function PersonPage({ params, searchParams }: Props) {
  const { person } = await params
  const decodedPerson = safeDecodeURIComponent(person)
  if (!decodedPerson) notFound()

  const allPeople = getAllPeople()
  if (!allPeople.some((info) => info.name === decodedPerson)) notFound()

  const { with: withParam } = await searchParams
  const extraPeople = Array.from(new Set(
    withParam
      ?.split(',')
      .map(safeDecodeURIComponent)
      .filter((value): value is string => Boolean(value)) ?? []
  ))
  const selected = Array.from(new Set([decodedPerson, ...extraPeople]))

  return (
    <Suspense>
      <PeopleClient person={decodedPerson} posts={getPostsByPeople(selected)} allPeople={allPeople} />
    </Suspense>
  )
}
