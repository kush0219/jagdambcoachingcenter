// src/components/GalleryView.tsx
import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Eye,
  X,
  Layers,
  Camera
} from 'lucide-react';
import { GalleryItem } from '../types.ts';

interface GalleryViewProps {
  galleryItems: GalleryItem[];
  setActiveTab: (tab: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  galleryItems,
  setActiveTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'events', label: 'Events' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'prize_distribution', label: 'Prize Distribution' },
    { id: 'classroom', label: 'Classroom' },
    { id: 'annual_day', label: 'Annual Day' },
  ];

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Banner */}
      <section className="bg-[#0f2942] text-white py-12 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-heading">
            Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            <button onClick={() => setActiveTab('home')} className="hover:text-orange-400">Home</button>
            <span className="mx-2">›</span>
            <span className="text-orange-400">Gallery</span>
          </p>
        </div>
      </section>

      {/* Filter Tabs matching reference 06. Gallery Page bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 cursor-pointer group flex flex-col"
            >
              <div className="relative overflow-hidden aspect-4/3 bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Photo</span>
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                    {item.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-[#0f2942] line-clamp-1 font-heading">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>

                {item.eventDate && (
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium border-t border-slate-100 mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>{item.eventDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
            <Camera className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No photos in this category yet.</p>
            <p className="text-xs text-slate-500">Check back soon for new event highlights!</p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4">
            <div className="relative aspect-16/10 bg-slate-900">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 pt-0 space-y-2">
              <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-md uppercase">
                {activeImage.category.replace('_', ' ')}
              </span>
              <h3 className="text-lg font-bold text-[#0f2942] font-heading">{activeImage.title}</h3>
              {activeImage.description && (
                <p className="text-xs text-slate-600">{activeImage.description}</p>
              )}
              {activeImage.eventDate && (
                <p className="text-xs text-slate-400">Date: {activeImage.eventDate}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
