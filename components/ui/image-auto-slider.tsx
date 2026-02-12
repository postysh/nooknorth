"use client";

import React, { useState } from 'react';

interface VillagerImage {
  src: string;
  alt: string;
  name?: string;
  species?: string;
  personality?: string;
  gender?: string;
  birthday?: string;
  catchphrase?: string;
  hobby?: string;
  titleColor?: string;
  quote?: string;
  sign?: string;
  favColors?: string[];
  favStyles?: string[];
  url?: string;
  photoUrl?: string;
}

interface ImageAutoSliderProps {
  images?: VillagerImage[];
}

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-64 md:w-72 lg:w-80 rounded-2xl overflow-hidden shadow-lg bg-card">
    <div className="relative pt-4 pb-2 px-4">
      <div className="w-full h-80 md:h-88 lg:h-96 bg-muted animate-pulse rounded-lg" />
    </div>
    <div className="px-4 pb-4 pt-2 space-y-3">
      <div className="h-5 bg-muted animate-pulse rounded w-2/3" />
      <div className="h-3 bg-muted animate-pulse rounded w-full" />
      <div className="flex gap-2">
        <div className="h-5 bg-muted animate-pulse rounded-full w-16" />
        <div className="h-5 bg-muted animate-pulse rounded-full w-20" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 bg-muted animate-pulse rounded w-12" />
        <div className="h-3 bg-muted animate-pulse rounded w-16" />
      </div>
    </div>
  </div>
);

// Replace white/near-white colors with a visible grey
function getSafeColor(hex?: string): string | undefined {
  if (!hex) return undefined;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // If all channels are > 230, it's too light
  if (r > 230 && g > 230 && b > 230) return 'b0b0b0';
  return hex;
}

export const Component = ({ images }: ImageAutoSliderProps) => {
  const [selectedVillager, setSelectedVillager] = useState<VillagerImage | null>(null);
  
  const showSkeleton = !images || images.length === 0;
  
  // Duplicate images for seamless loop
  const duplicatedImages = images ? [...images, ...images] : [];

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right 150s linear infinite;
        }

        .scroll-container:hover .infinite-scroll {
          animation-play-state: paused;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-item:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>
      
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
        
        {/* Scrolling images container */}
        <div className="relative z-10 w-full flex items-center justify-center py-4">
            <div className="scroll-container w-full">
            <div className={`flex gap-6 w-max py-4 ${!showSkeleton ? 'infinite-scroll' : ''}`}>
              {showSkeleton ? (
                // Show skeleton cards
                Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : duplicatedImages.map((image, index) => (
                <div
                  key={index}
                  className="image-item flex-shrink-0 w-64 md:w-72 lg:w-80 rounded-2xl overflow-hidden shadow-lg bg-card hover:shadow-xl transition-shadow cursor-pointer"
                  style={getSafeColor(image.titleColor) ? { borderTop: `4px solid #${getSafeColor(image.titleColor)}` } : {}}
                  onClick={() => image.name && setSelectedVillager(image)}
                >
                  <div 
                    className="relative pt-4 pb-2 px-4"
                    style={getSafeColor(image.titleColor) ? { background: `linear-gradient(to bottom, #${getSafeColor(image.titleColor)}15, transparent)` } : {}}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-80 md:h-88 lg:h-96 object-contain drop-shadow-md"
                      loading="lazy"
                    />
                  </div>
                  {image.name && (
                    <div className="px-4 pb-4 pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-base text-foreground">{image.name}</h3>
                        {image.hobby && (
                          <span className="text-sm" title={image.hobby}>
                            {image.hobby === 'Education' && '📚'}
                            {image.hobby === 'Fitness' && '💪'}
                            {image.hobby === 'Music' && '🎵'}
                            {image.hobby === 'Nature' && '🌱'}
                            {image.hobby === 'Play' && '🎮'}
                            {image.hobby === 'Fashion' && '👗'}
                          </span>
                        )}
                      </div>
                      {image.catchphrase && (
                        <p className="text-xs text-muted-foreground italic mb-2">"{image.catchphrase}"</p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {image.species && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {image.species}
                          </span>
                        )}
                        {image.personality && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                            {image.personality}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        {image.gender && <span>{image.gender}</span>}
                        {image.birthday && <span>🎂 {image.birthday}</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>

      {/* Modal - only render when not showing skeleton */}
      {!showSkeleton && selectedVillager && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedVillager(null)}
        >
          <div 
            className="bg-card rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            style={getSafeColor(selectedVillager.titleColor) ? { borderTop: `6px solid #${getSafeColor(selectedVillager.titleColor)}` } : {}}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="relative p-6"
              style={getSafeColor(selectedVillager.titleColor) ? { background: `linear-gradient(to bottom, #${getSafeColor(selectedVillager.titleColor)}20, transparent)` } : {}}
            >
              <button
                onClick={() => setSelectedVillager(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M18 6L6 18"/>
                  <path d="M6 6l12 12"/>
                </svg>
              </button>
              <img
                src={selectedVillager.src}
                alt={selectedVillager.alt}
                className="w-48 h-48 object-contain mx-auto drop-shadow-lg"
              />
            </div>
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-foreground">{selectedVillager.name}</h2>
                {selectedVillager.hobby && (
                  <span className="text-2xl" title={selectedVillager.hobby}>
                    {selectedVillager.hobby === 'Education' && '📚'}
                    {selectedVillager.hobby === 'Fitness' && '💪'}
                    {selectedVillager.hobby === 'Music' && '🎵'}
                    {selectedVillager.hobby === 'Nature' && '🌱'}
                    {selectedVillager.hobby === 'Play' && '🎮'}
                    {selectedVillager.hobby === 'Fashion' && '👗'}
                  </span>
                )}
              </div>
              {selectedVillager.catchphrase && (
                <p className="text-muted-foreground italic mb-4">"{selectedVillager.catchphrase}"</p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedVillager.species && (
                  <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {selectedVillager.species}
                  </span>
                )}
                {selectedVillager.personality && (
                  <span className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {selectedVillager.personality}
                  </span>
                )}
                {selectedVillager.hobby && (
                  <span className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    {selectedVillager.hobby}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                {selectedVillager.gender && (
                  <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium text-foreground">{selectedVillager.gender}</p>
                  </div>
                )}
                {selectedVillager.birthday && (
                  <div>
                    <p className="text-muted-foreground">Birthday</p>
                    <p className="font-medium text-foreground">🎂 {selectedVillager.birthday}</p>
                  </div>
                )}
                {selectedVillager.sign && (
                  <div>
                    <p className="text-muted-foreground">Star Sign</p>
                    <p className="font-medium text-foreground">✨ {selectedVillager.sign}</p>
                  </div>
                )}
              </div>
              {selectedVillager.name && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">About</p>
                  <p className="text-sm text-foreground">
                    {selectedVillager.name} is a {selectedVillager.personality?.toLowerCase()} {selectedVillager.species?.toLowerCase()} villager
                    {selectedVillager.hobby && ` who loves ${selectedVillager.hobby.toLowerCase()}`}.
                    {selectedVillager.catchphrase && ` Known for saying "${selectedVillager.catchphrase}"`}
                    {selectedVillager.birthday && `, ${selectedVillager.gender === 'Male' ? 'his' : 'her'} birthday is on ${selectedVillager.birthday}`}.
                  </p>
                  {selectedVillager.quote && (
                    <p className="text-sm text-muted-foreground italic mt-2">"{selectedVillager.quote}"</p>
                  )}
                </div>
              )}
              {(selectedVillager.favColors?.length || selectedVillager.favStyles?.length) && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Gifting Preferences</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedVillager.favColors?.map((color, i) => (
                      <span key={`color-${i}`} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        🎨 {color}
                      </span>
                    ))}
                    {selectedVillager.favStyles?.map((style, i) => (
                      <span key={`style-${i}`} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        👕 {style}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedVillager.url && (
                <a
                  href={selectedVillager.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center text-sm py-2 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  View on Nookipedia →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
