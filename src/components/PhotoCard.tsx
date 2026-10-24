import { useState } from 'react';
import { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
}

export function PhotoCard({ photo, isFavourite, onToggleFavourite }: PhotoCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fast-loading optimized dimensions for grid cards with fallback to original download_url
  const optimizedImageUrl = `https://picsum.photos/id/${photo.id}/600/400`;

  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Photo Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {!isLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse">
            <span className="text-xs text-slate-400">Loading photo...</span>
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <svg
              className="w-8 h-8 mb-1.5 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Image unavailable</span>
          </div>
        ) : (
          <img
            src={optimizedImageUrl}
            alt={`Photo by ${photo.author}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>

      {/* Card Details: Author and Heart Button */}
      <div className="p-4 flex items-center justify-between gap-3 bg-white">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500 font-medium">Photographer</p>
          <h3 className="text-sm font-semibold text-slate-900 truncate" title={photo.author}>
            {photo.author}
          </h3>
        </div>

        {/* Heart Toggle Button */}
        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-label={
            isFavourite
              ? `Remove photo by ${photo.author} from favourites`
              : `Add photo by ${photo.author} to favourites`
          }
          className={`p-2 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
            isFavourite
              ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
              : 'text-slate-400 bg-slate-50 hover:text-slate-600 hover:bg-slate-100'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 transition-transform active:scale-90"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavourite ? '1.5' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>
    </article>
  );
}
