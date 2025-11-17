'use client';
import React from 'react';
import { cn } from '@/lib/utils';

import Lenis from '@studio-freight/lenis'
import { ZoomParallax } from "@/components/ui/zoom-parallax";

export default function DefaultDemo() {

	React.useEffect( () => {
        const lenis = new Lenis()
       
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    },[])


	const images = [
		{
			src: '/karuna/Screenshot From 2025-11-16 23-57-40.png',
			alt: 'Modern architecture building',
		},
		{
			src: '/karuna/Screenshot From 2025-11-16 23-51-54.png',
			alt: 'Urban cityscape at sunset',
		},
		{
			src: '/karuna/Screenshot From 2025-11-16 23-54-48.png',
			alt: 'Abstract geometric pattern',
		},
		{
			src: '/karuna/Screenshot From 2025-11-16 23-23-16.png',
			alt: 'Mountain landscape',
		},
		{
			src: '/karuna/Screenshot From 2025-11-16 23-50-34.png',
			alt: 'Minimalist design elements',
		},
		{
			src: '/karuna/Screenshot From 2025-11-16 23-56-02.png',
			alt: 'Ocean waves and beach',
		},
		{
			src: '/karuna/Screenshot From 2025-11-16 23-48-17.png',
			alt: 'Forest trees and sunlight',
		},
	];

	return (
		<main className="min-h-screen w-full">
			<div className="relative flex h-[50vh] items-center justify-center">
				{/* Radial spotlight */}
				<div
					aria-hidden="true"
					className={cn(
						'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
						'bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]',
						'blur-[30px]',
					)}
				/>
				<h1 className="text-center text-4xl font-bold">
					From Detection to Consultation — Effortlessly.
				</h1>
			</div>
			<ZoomParallax images={images} />
			<div className="h-[50vh]"/>
		</main>
	);
}
