'use client';

import React, { Suspense, lazy } from 'react';
import type { SAAComponent } from '@/data/saa-component-registry';

interface ComponentPreviewProps {
  component: SAAComponent;
}

/**
 * Component Preview Wrapper
 *
 * Dynamically imports and renders React components for preview.
 * Handles loading states and errors gracefully.
 */
export function ComponentPreview({ component }: ComponentPreviewProps) {
  if (!component.reactPath || !component.converted) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-[#dcdbd5] text-lg mb-4">
            Component not yet converted to React
          </p>
          <p className="text-[#dcdbd5]/60 text-sm">
            Convert this component to see a live preview
          </p>
        </div>
      </div>
    );
  }

  // Map component IDs to their actual imports
  const PreviewComponent = React.useMemo(() => {
    switch (component.id) {
      // Buttons
      case 'cta-button':
        return lazy(() => import('@/components/saa/buttons/CTAButton').then(m => ({ default: () => <m.CTAButton>Get Started</m.CTAButton> })));
      case 'secondary-button':
        return lazy(() => import('@/components/saa/buttons/SecondaryButton').then(m => ({ default: () => <m.SecondaryButton>Learn More</m.SecondaryButton> })));

      // Cards
      // TODO: Re-enable after CyberCardStackedAnimation is created
      // case 'stacked-animation-cards':
      //   return lazy(() => import('@/components/saa/cards/CyberCardStackedAnimation').then(m => ({
      //     default: () => (
      //       <m.CyberCardStackedAnimation className="w-full max-w-md">
      //         <h3 className="text-2xl font-bold text-[#ffd700] mb-4">Stacked Card</h3>
      //         <p className="text-[#dcdbd5]">Hover to see the stacked animation effect</p>
      //       </m.CyberCardStackedAnimation>
      //     )
      //   })));
      case 'cyber-card-prismatic-glass':
        return lazy(() => import('@/components/saa/cards/CyberCardPrismaticGlass').then(m => ({
          default: () => (
            <m.CyberCardPrismaticGlass className="w-full max-w-md">
              <h3 className="text-2xl font-bold text-[#ffd700] mb-4">Prismatic Glass</h3>
              <p className="text-[#dcdbd5]">Glass morphism with prismatic light effects</p>
            </m.CyberCardPrismaticGlass>
          )
        })));
      case 'cyber-card-holographic':
        return lazy(() => import('@/components/saa/cards/CyberCardHolographic').then(m => ({
          default: () => (
            <m.CyberCardHolographic className="w-full max-w-md">
              <h3 className="text-2xl font-bold text-[#ffd700] mb-4">Holographic Card</h3>
              <p className="text-[#dcdbd5]">Futuristic holographic border and glow effects</p>
            </m.CyberCardHolographic>
          )
        })));
      case 'cyber-card-industrial-metal':
        return lazy(() => import('@/components/saa/cards/CyberCardIndustrialMetal').then(m => ({
          default: () => (
            <m.CyberCardIndustrialMetal className="w-full max-w-md">
              <h3 className="text-2xl font-bold text-[#ffd700] mb-4">Industrial Metal</h3>
              <p className="text-[#dcdbd5]">Industrial metal plate design</p>
            </m.CyberCardIndustrialMetal>
          )
        })));
      // TODO: Re-enable after CyberCardNeuralNetwork is created
      // case 'cyber-card-neural-network':
      //   return lazy(() => import('@/components/saa/cards/CyberCardNeuralNetwork').then(m => ({
      //     default: () => (
      //       <m.CyberCardNeuralNetwork className="w-full max-w-md">
      //         <h3 className="text-2xl font-bold text-[#ffd700] mb-4">Neural Network</h3>
      //         <p className="text-[#dcdbd5]">Neural network visualization</p>
      //       </m.CyberCardNeuralNetwork>
      //     )
      //   })));
      // TODO: Re-enable after StrategicTrustBuilder is created
      // case 'strategic-trust-builder':
      //   return lazy(() => import('@/components/saa/cards/StrategicTrustBuilder').then(m => ({
      //     default: () => (
      //       <m.StrategicTrustBuilder className="w-full max-w-md">
      //         <h3 className="text-2xl font-bold text-[#ffd700] mb-4">Strategic Trust</h3>
      //         <p className="text-[#dcdbd5]">Trust-building design pattern</p>
      //       </m.StrategicTrustBuilder>
      //     )
      //   })));

      // Navigation & Gallery
      // TODO: Re-enable after Scrollport and ScrollGallery are created
      // case 'scrollport':
      //   return lazy(() => import('@/components/saa/navigation/Scrollport').then(m => ({
      //     default: () => (
      //       <m.Scrollport
      //         items={[
      //           { id: 'section1', label: 'Section 1', content: <div className="p-8"><h3 className="text-2xl text-[#ffd700]">Section 1</h3></div> },
      //           { id: 'section2', label: 'Section 2', content: <div className="p-8"><h3 className="text-2xl text-[#ffd700]">Section 2</h3></div> },
      //           { id: 'section3', label: 'Section 3', content: <div className="p-8"><h3 className="text-2xl text-[#ffd700]">Section 3</h3></div> }
      //         ]}
      //       />
      //     )
      //   })));
      // case 'scroll-gallery':
      //   return lazy(() => import('@/components/saa/gallery/ScrollGallery').then(m => ({
      //     default: () => (
      //       <m.ScrollGallery
      //         items={[
      //           { id: '1', title: 'Item 1', content: <div className="h-64 bg-gradient-to-br from-[#ffd700]/20 to-[#00ff88]/20 rounded-lg flex items-center justify-center"><span className="text-2xl text-[#ffd700]">Item 1</span></div> },
      //           { id: '2', title: 'Item 2', content: <div className="h-64 bg-gradient-to-br from-[#00ff88]/20 to-[#ffd700]/20 rounded-lg flex items-center justify-center"><span className="text-2xl text-[#00ff88]">Item 2</span></div> },
      //           { id: '3', title: 'Item 3', content: <div className="h-64 bg-gradient-to-br from-[#ffd700]/20 to-[#00ff88]/20 rounded-lg flex items-center justify-center"><span className="text-2xl text-[#ffd700]">Item 3</span></div> }
      //         ]}
      //       />
      //     )
      //   })));

      // Effects
      // TODO: Re-enable after TextScramble is created
      // case 'text-scramble':
      //   return lazy(() => import('@/components/saa/text/TextScramble').then(m => ({
      //     default: () => (
      //       <div className="flex items-center justify-center h-full">
      //         <m.TextScramble text="SAA Building Blocks">
      //           SAA Building Blocks
      //         </m.TextScramble>
      //       </div>
      //     )
      //   })));

      // Interactive
      case 'icon-library':
        return lazy(() => import('@/components/saa/icons/IconLibrary').then(m => ({
          default: () => (
            <div className="w-full h-full p-8">
              <m.IconLibrary size="large" showLabels />
            </div>
          )
        })));


      default:
        return () => (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#dcdbd5]">
              Preview not configured for component: {component.id}
            </p>
          </div>
        );
    }
  }, [component.id]);

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-transparent">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-[#ffd700] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#dcdbd5]">Loading preview...</p>
          </div>
        }
      >
        <PreviewComponent />
      </Suspense>
    </div>
  );
}
