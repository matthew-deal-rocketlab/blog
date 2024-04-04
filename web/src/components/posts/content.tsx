'use client'

import hljs from 'highlight.js'
import 'highlight.js/styles/night-owl.css'
import { useEffect } from 'react'

type Post = {
  content: string
}

export default function Content({ content }: Post) {
  useEffect(() => {
    const highlighter = async () => {
      hljs.highlightAll()
    }
    highlighter()
  }, [content])

  return (
    <div
      className="prose mb-8 max-w-4xl prose-pre:p-0"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
