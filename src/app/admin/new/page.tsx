import type { Metadata } from 'next';

import { cities } from '@/lib/geo';
import { services } from '@/lib/services';
import { NewBatchForm } from './NewBatchForm';

export const metadata: Metadata = { title: 'New batch' };

export default function NewBatchPage() {
  return (
    <div className="container max-w-4xl py-10">
      <h2 className="text-2xl font-bold text-white">Start a new batch</h2>
      <p className="mt-2 text-navy-300">
        List what you want written today — a blog topic, or a service in one of our active
        cities — and the AI writer drafts it in your house style: no invented stats, no fake
        reviews, honest about tradeoffs. Nothing goes live until you approve it in the review
        queue.
      </p>

      <div className="mt-8">
        <NewBatchForm
          services={services.map((s) => ({ slug: s.slug, name: s.name }))}
          cities={cities.map((c) => ({ slug: c.slug, name: c.name }))}
        />
      </div>
    </div>
  );
}
