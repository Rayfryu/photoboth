/**
 * Snapbooth - Modern Web Photobooth Application
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { HowItWorks } from './components/HowItWorks';
import { PhotoboothStudio } from './components/Studio/PhotoboothStudio';
import { GalleryView } from './components/Gallery/GalleryView';
import { ShowcaseView } from './components/Showcase/ShowcaseView';
import { SupabaseModal } from './components/SupabaseModal';
import { Footer } from './components/Footer';
import { FrameStyle, LayoutType } from './types/photobooth';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'studio' | 'gallery' | 'showcase'>('home');
  const [selectedStyle, setSelectedStyle] = useState<FrameStyle>('classic-white');
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('strip-3');
  const [isCloudModalOpen, setIsCloudModalOpen] = useState<boolean>(false);

  // When user selects a style from showcase or landing
  const handleSelectStyle = (style: FrameStyle, layout: LayoutType) => {
    setSelectedStyle(style);
    setSelectedLayout(layout);
    setCurrentTab('studio');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900">
      
      {/* 3-Zone Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCloudModal={() => setIsCloudModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        
        {/* Tab 1: Home Landing Page */}
        {currentTab === 'home' && (
          <div>
            <LandingHero
              onStart={() => setCurrentTab('studio')}
              onExploreStyles={() => setCurrentTab('showcase')}
            />
            <HowItWorks onStart={() => setCurrentTab('studio')} />
          </div>
        )}

        {/* Tab 2: Dedicated Photobooth Studio */}
        {currentTab === 'studio' && (
          <PhotoboothStudio
            initialStyle={selectedStyle}
            initialLayout={selectedLayout}
            onNavigateToGallery={() => setCurrentTab('gallery')}
          />
        )}

        {/* Tab 3: Saved Gallery Archive */}
        {currentTab === 'gallery' && (
          <GalleryView
            onStartNewSession={() => setCurrentTab('studio')}
            openCloudModal={() => setIsCloudModalOpen(true)}
          />
        )}

        {/* Tab 4: Frame & Layout Showcase */}
        {currentTab === 'showcase' && (
          <ShowcaseView onSelectStyle={handleSelectStyle} />
        )}

      </main>

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Optional Supabase Cloud Settings Modal */}
      <SupabaseModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
      />

    </div>
  );
}
