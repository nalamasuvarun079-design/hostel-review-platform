import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const HostelGallery = ({ photos = [], title = "Hostel Photos" }) => {
  const defaultPhotos = [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
  ];

  const imagesList = photos && photos.length > 0 ? photos : defaultPhotos;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      
      {/* Main Image Showcase */}
      <div className="relative h-[320px] sm:h-[420px] w-full rounded-2xl overflow-hidden bg-gray-900 group shadow-md">
        <img
          src={imagesList[selectedIndex]}
          alt={`${title} - photo ${selectedIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Gallery Navigation Overlay Arrows */}
        {imagesList.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Fullscreen Button & Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
          >
            <Maximize2 size={13} />
            Fullscreen
          </button>
        </div>

        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-md font-mono">
          {selectedIndex + 1} / {imagesList.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {imagesList.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {imagesList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-blue-600 ring-2 ring-blue-400 scale-95'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
          >
            <X size={28} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md"
          >
            <ChevronLeft size={24} />
          </button>

          <img
            src={imagesList[selectedIndex]}
            alt="Fullscreen view"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

    </div>
  );
};

export default HostelGallery;
