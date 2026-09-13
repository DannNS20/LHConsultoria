import { Suspense } from 'react';
import { About } from '@/components/home/About';
import { Contact } from '@/components/home/Contact';
import { Hero } from '@/components/home/Hero';
import { LatestPosts, LatestPostsSkeleton } from '@/components/home/LatestPosts';
import { Process } from '@/components/home/Process';
import { Reasons } from '@/components/home/Reasons';
import { Services } from '@/components/home/Services';
import { StatsBar } from '@/components/home/StatsBar';
import { TopicsLoop } from '@/components/home/TopicsLoop';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TopicsLoop />
      <StatsBar />
      <About />
      <Services />
      <Process />
      <Reasons />
      <Suspense fallback={<LatestPostsSkeleton />}>
        <LatestPosts />
      </Suspense>
      <Contact />
    </>
  );
}
