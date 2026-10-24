import { useState, useCallback, useMemo, useReducer } from 'react';
import { useFetchPhotos } from '../hooks/useFetchPhotos';
import { favouritesReducer, getInitialFavourites } from '../reducers/favouritesReducer';
import { PhotoCard } from './PhotoCard';

export function Gallery() {
  // 1. Fetch photos using custom hook (Gallery does not fetch directly)
  const { photos, loading, error, refetch } = useFetchPhotos();

  // 2. Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Favourites managed strictly via useReducer with localStorage restoration
  const [favourites, dispatch] = useReducer(favouritesReducer, [], getInitialFavourites);

  // 4. Search input handler memoized with useCallback
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  // 5. Filter already-fetched photos by author name in real time using useMemo
  const filteredPhotos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return photos;
    }
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query)
    );
  }, [photos, searchQuery]);

  // 6. Action dispatcher for toggling favourite status
  const handleToggleFavourite = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: id });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* App Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Photo Gallery
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {photos.length > 0 && `${photos.length} photos loaded`}
                {favourites.length > 0 && ` · ${favourites.length} saved in favourites`}
              </p>
            </div>

            {/* Search Input at the top of the gallery */}
            <div className="w-full sm:w-80">
              <label htmlFor="author-search" className="sr-only">
                Filter photos by author name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  id="author-search"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Filter by author name..."
                  className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search input"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* State 1: Loading Spinner */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-700">Fetching photos from Picsum...</p>
            <p className="text-xs text-slate-400 mt-1">Please wait while the gallery loads</p>
          </div>
        )}

        {/* State 2: Error Message */}
        {!loading && error && (
          <div className="max-w-lg mx-auto my-12 p-6 bg-rose-50 border border-rose-200 rounded-xl text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-rose-900 mb-1">
              Unable to Load Photos
            </h2>
            <p className="text-sm text-rose-700 mb-5">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 active:scale-98 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* State 3: Empty Filter Results */}
        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-slate-800 mb-1">
              No matching photographers
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              We couldn't find any photo by &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-medium text-slate-900 underline hover:text-slate-700 cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        )}

        {/* State 4: Responsive Photo Grid (Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns) */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing {filteredPhotos.length} of {photos.length} photos
              </span>
              {searchQuery && (
                <span className="italic">
                  Filtered by &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isFavourite={favourites.includes(photo.id)}
                  onToggleFavourite={handleToggleFavourite}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>Photo Gallery &middot; Powered by Picsum Photos API</p>
      </footer>
    </div>
  );
}
