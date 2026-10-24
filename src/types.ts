export interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type FavouritesAction =
  | { type: 'TOGGLE_FAVOURITE'; payload: string }
  | { type: 'SET_FAVOURITES'; payload: string[] };
