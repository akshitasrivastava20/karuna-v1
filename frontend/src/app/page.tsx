'use client';

import Navigation from '@/components/Navigation';
import { SplineSceneBasic } from '@/components/SplineScene';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="min-h-screen p-8">
        <div className="container mx-auto pt-20">
          <SplineSceneBasic />
        </div>
      </div>
    </div>
  );
}
