"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';

interface CarouselProps {
  images: string[];
  title: string;
  className?: string;
}

export function Carousel({ images, title, className = "" }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalImage = () => {
    setModalImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevModalImage = () => {
    setModalImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Gestion des touches clavier pour la modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModalOpen) {
        switch (event.key) {
          case 'Escape':
            closeModal();
            break;
          case 'ArrowLeft':
            prevModalImage();
            break;
          case 'ArrowRight':
            nextModalImage();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Carousel principal */}
      <div className={`relative w-full ${className}`}>
        {/* Images */}
        <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl bg-zinc-900/50">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out cursor-pointer group ${
                index === currentIndex ? 'translate-x-0' : 
                index < currentIndex ? '-translate-x-full' : 'translate-x-full'
              }`}
              onClick={() => openModal(index)}
            >
              <Image
                src={image}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
              
              {/* Overlay zoom */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contrôles navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicateurs */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white scale-110' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal plein écran */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Bouton fermer */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image principale */}
          <div 
            className="relative max-w-[90vw] max-h-[80vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[modalImageIndex]}
              alt={`${title} - Image ${modalImageIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Contrôles navigation modal */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevModalImage();
                }}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextModalImage();
                }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Indicateurs modal */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImageIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === modalImageIndex 
                        ? 'bg-white scale-110' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
} 