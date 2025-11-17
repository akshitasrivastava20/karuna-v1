'use client';

import { SplineSceneBasic } from '@/components/SplineScene';
import { CometCard } from '@/components/ui/comet-card';
import { MorphingText } from "@/components/ui/morphing-text";
import Image from 'next/image';

const texts = [
  "Need medical help right now?",
  "Hop on a call instantly.",
  "Real doctors. Real time. Zero hassle"
];

function MorphingTextDemo() {
  return <MorphingText texts={texts} className="text-[30pt] lg:text-[3.5rem]" />;
}

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto pt-20">
        <SplineSceneBasic />
        
        {/* CometCard and MorphingText Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
          {/* CometCard Section */}
          <div className="flex justify-center lg:justify-start lg:pl-8">
            <CometCard className="w-80 max-w-sm">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/Virtual Care.jpeg"
                  alt="Virtual Care"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </CometCard>
          </div>
          
          {/* MorphingText Section */}
          <div className="flex justify-center lg:justify-start">
            <MorphingTextDemo />
          </div>
        </div>
      </div>

    </div>
  );
}
