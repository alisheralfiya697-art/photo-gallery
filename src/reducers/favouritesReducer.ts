import { FavouritesAction } from '../types';

export const FAVOURITES_STORAGE_KEY = 'photo_gallery_favourites';

/**
 * Lazy initializer function for useReducer.
 * Restores favourites from localStorage on page load.
 */
export function getInitialFavourites(): string[] {
  try {
    const saved = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Could not restore favourites from localStorage:', err);
  }
  return [];
}

/**
 * Reducer function managing the favourites array (list of photo IDs).
 * Toggles a photo's favourite status and persists the result to localStorage.
 */
export function favouritesReducer(state: string[], action: FavouritesAction): string[] {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const photoId = action.payload;
      const isFav = state.includes(photoId);
      const updated = isFav
        ? state.filter((id) => id !== photoId)
        : [...state, photoId];

      try {
        localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Could not save favourites to localStorage:', err);
      }

      return updated;
    }

    case 'SET_FAVOURITES': {
      return action.payload;
    }

    default:
      return state;
  }
}
