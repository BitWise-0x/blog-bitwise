'use client'

import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

interface ShareLinksProps {
  path: string
  title?: string
}

export default function ShareLinks({ path, title }: ShareLinksProps) {
  const [copied, setCopied] = useState(false)
  const url = `${siteMetadata.siteUrl}/${path}`

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ url })
    } else {
      await handleCopyLink()
    }
  }

  const handleShareToX = () => {
    const text = title ? `${title}` : ''
    const xUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    window.open(xUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="prose-summary flex gap-1 pt-6 pb-6 text-sm">
      <button onClick={handleShareToX} className="text-link">
        Share to X
      </button>
      {` • `}
      <button onClick={handleShare} className="text-link">
        Share
      </button>
      {` • `}
      <button onClick={handleCopyLink} className="text-link">
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}
