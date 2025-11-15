'use client';

import Navigation from '@/components/Navigation';
import { SplineSceneBasic } from '@/components/SplineScene';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div 
        className="min-h-screen bg-repeat bg-center p-8"
        style={{ 
          backgroundImage: "url('/images/Gemini_Generated_Image_71076g71076g7107.png')",
          backgroundSize: "250px 250px"
        }}
      >
        <div className="container mx-auto pt-20">
          <SplineSceneBasic />
        </div>
      </div>
    </div>
  );
}
