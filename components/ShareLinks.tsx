'use client'

import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

interface ShareLinksProps {
  path: string
}

export default function ShareLinks({ path }: ShareLinksProps) {
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

  return (
    <div className="flex gap-1 pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
      <button
        onClick={handleShare}
        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
      >
        Share
      </button>
      {` • `}
      <button
        onClick={handleCopyLink}
        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
      >
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}
