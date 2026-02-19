import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'

interface RelatedPostsProps {
  currentSlug: string
  currentTags: string[]
  posts: CoreContent<Blog>[]
}

export default function RelatedPosts({ currentSlug, currentTags, posts }: RelatedPostsProps) {
  const related = posts
    .filter((post) => post.slug !== currentSlug && !post.draft)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => currentTags.includes(tag))
      return { ...post, sharedTagCount: sharedTags.length }
    })
    .filter((post) => post.sharedTagCount > 0)
    .sort((a, b) => {
      if (b.sharedTagCount !== a.sharedTagCount) return b.sharedTagCount - a.sharedTagCount
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <h2 className="pt-6 pb-4 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
        Related Articles
      </h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {related.map((post) => (
          <li key={post.slug} className="py-4">
            <article>
              <div className="space-y-1">
                <h3 className="text-lg leading-7 font-bold tracking-tight">
                  <Link href={`/blog/${post.slug}`} className="text-gray-900 dark:text-gray-100">
                    {post.title}
                  </Link>
                </h3>
                <div className="flex flex-wrap items-center gap-x-3">
                  <time dateTime={post.date} className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(post.date, siteMetadata.locale)}
                  </time>
                  {post.tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
                {post.summary && (
                  <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {post.summary}
                  </p>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
