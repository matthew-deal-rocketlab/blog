'use client'

import hljs from 'highlight.js'
import 'highlight.js/styles/night-owl.css' // or choose another style
import { useEffect } from 'react'

export default function Content({ post }: any) {
  useEffect(() => {
    hljs.highlightAll()
  }, [])

  return (
    <div
      className="prose-pre:none prose mb-8 max-w-5xl prose-code:p-10 prose-pre:p-0"
      dangerouslySetInnerHTML={{ __html: post.content }}
    />
  )
}
