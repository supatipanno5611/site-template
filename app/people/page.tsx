import { Suspense } from 'react'
import { getAllPeople } from '@/lib/people'
import PeopleClient from './PeopleClient'

export default function PeoplePage() {
  return (
    <Suspense>
      <PeopleClient person={null} posts={[]} allPeople={getAllPeople()} />
    </Suspense>
  )
}
