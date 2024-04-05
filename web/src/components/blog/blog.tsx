'use client'

import Grid from '../ui/grid'
import Posts from './posts'
import { useAuth } from '@/context/authProvider'
import { Post } from '@/app/admin/page'

import { Skeleton } from '../ui/skeleton'
import PostStates from './postStates'
import { Input } from '../ui/input'
import { useState } from 'react'
import { Badge } from '../ui/badge'
import { useSearchParams } from 'next/navigation'

type AllBlogsProps = {
  data: Post[]
}

type CategoryCounts = {
  [key: string]: number
}

export default function AllBlogs({ data }: AllBlogsProps) {
  const { user, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  const handleBadgeClick = (category: string) => {
    // Toggle category filter on click; if same category clicked, clear the filter
    if (category === categoryFilter) {
      setCategoryFilter(null)
    } else {
      setCategoryFilter(category)
    }
  }

  const filteredData = data.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const categoryMatch = categoryFilter ? post.category === categoryFilter : true
    return titleMatch && categoryMatch
  })

  const categoryCounts = data.reduce((acc: CategoryCounts, { category }) => {
    if (typeof category === 'string') {
      acc[category] = (acc[category] || 0) + 1
    }
    return acc
  }, {} as CategoryCounts)

  if (isLoading)
    return (
      <>
        <Skeleton className="h-5 w-[230px]" />
        <Skeleton className="h-5 w-[250px]" />
        <Skeleton className="mt-5 h-10 w-[100px]" />
      </>
    )

  return (
    <main>
      <PostStates data={data} user={user} />
      <div className="mb-16 flex flex-col gap-5">
        {filteredData && filteredData.length > 0 && (
          <Input
            type="search"
            placeholder="Search for a post"
            className=" w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        )}
        <div className="flex flex-row flex-wrap gap-5">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <Badge
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleBadgeClick(category)
                }
              }}
              onClick={() => handleBadgeClick(category)}
              variant={'pill'}
              key={category}
              className="cursor-pointer bg-black py-2 text-sm text-white">
              {`${category} ${count}`}
            </Badge>
          ))}
          <Badge
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleBadgeClick('')
              }
            }}
            onClick={() => handleBadgeClick('')}
            variant={'pill'}
            className="cursor-pointer bg-black py-2 text-sm text-white">
            Show All
          </Badge>
        </div>
      </div>

      <Grid cols={4} className="grid-cols-1 md:grid-cols-4">
        {filteredData.map(({ title, id, content, created_at, sub_title }, index) => (
          <Posts
            shouldFocus={index === 0}
            key={id}
            id={id}
            content={content}
            title={title}
            sub_title={sub_title}
            created_at={created_at}
          />
        ))}
      </Grid>
    </main>
  )
}
