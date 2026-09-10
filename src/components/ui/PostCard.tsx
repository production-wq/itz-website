import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

import { formatDate, type PostSummary } from '@/lib/posts';

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-card-hover focus-within:-translate-y-1 focus-within:shadow-card-hover">
      {post.heroImage ? (
        <div className="media-zoom relative aspect-[16/9] overflow-hidden bg-navy-50">
          <Image
            src={post.heroImage}
            alt=""
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-7">
        {post.categories[0] ? (
          <p className="text-eyebrow uppercase text-blue-600">{post.categories[0]}</p>
        ) : null}

        <h2 className="mt-3 text-lg font-bold leading-snug text-navy-700">
          <Link href={`/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h2>

        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">{post.excerpt}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-navy-100 pt-5 text-xs text-ink-500">
          {post.date ? <time dateTime={post.date}>{formatDate(post.date)}</time> : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readingTime} min read
          </span>
          <ArrowRight
            className="ml-auto h-4 w-4 text-blue-600 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}
