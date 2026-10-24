# Photo Gallery Web App

A clean, responsive, beginner-friendly Photo Gallery application built with React, Vite, and Tailwind CSS. The app fetches photos from the Lorem Picsum API, supports real-time author filtering, and persists favourites in `localStorage` using React hooks.

---

## Features

- **React + Vite**: Fast modern frontend tooling.
- **Tailwind CSS Styling**: Responsive styling with zero component libraries (no MUI, Ant Design, or Bootstrap).
- **Custom Hook (`useFetchPhotos`)**:
  - Fetches 30 photos on page load from `https://picsum.photos/v2/list?limit=30`.
  - Encapsulates fetch logic, loading status, error handling, and abort signals.
  - Returns `{ photos, loading, error, refetch }`.
  - The `Gallery` component consumes this hook and does not perform direct fetches.
- **Loading & Error Handling**:
  - Displays a clean loading spinner while photos are being fetched.
  - Displays a clear error message with a "Try Again" retry action if the API call fails.
- **Responsive Grid**:
  - **Mobile (< 640px)**: 1 column (`grid-cols-1`)
  - **Tablet (640px – 1023px)**: 2 columns (`sm:grid-cols-2`)
  - **Desktop (≥ 1024px)**: 4 columns (`lg:grid-cols-4`)
- **Real-Time Author Search**:
  - Search input at the top of the gallery.
  - Filters already-fetched photos by author name in real time without extra API calls or page reloads.
  - Search input handler is memoized with `useCallback`.
  - Filtered photo list is computed using `useMemo`.
- **Favourites with `useReducer`**:
  - Favourites state is managed strictly via `useReducer` (no `useState` for favourites).
  - Toggling a heart button dispatches a `TOGGLE_FAVOURITE` action.
  - Favourites are saved to and restored from `localStorage` using a lazy initializer function.

---

## Project Structure

```text
├── index.html
├── package.json
├── README.md
├── src/
│   ├── App.tsx                    # Main App entry mounting the Gallery
│   ├── index.css                  # Tailwind CSS import
│   ├── main.tsx                   # React root entry point
│   ├── types.ts                   # TypeScript interfaces (Photo, FavouritesAction)
│   ├── hooks/
│   │   └── useFetchPhotos.ts      # Custom hook returning { photos, loading, error }
│   ├── reducers/
│   │   └── favouritesReducer.ts   # Reducer for favourites state & localStorage sync
│   └── components/
│       ├── Gallery.tsx            # Main gallery container (search, grid, states)
│       └── PhotoCard.tsx          # Card displaying image, author, and heart button
├── tsconfig.json
└── vite.config.ts
```

---

## Installation & Running Locally

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### Steps

1. **Clone the repository or navigate to the project directory**:
   ```bash
   cd react-example
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *(Note: If you encounter peer dependency warnings with Vite or esbuild, run `npm install --legacy-peer-deps`)*

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) (or the URL printed in the terminal).

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## Technical Architecture & Screening Interview Notes

When explaining this project in an interview, highlight the following concepts:

### 1. Custom Hook (`useFetchPhotos`)
- **Separation of Concerns**: The Gallery component handles presentation and user interaction, while `useFetchPhotos` handles data retrieval and network state.
- **Clean Lifecycle**: Uses an `AbortController` inside `useEffect` to abort pending requests if the component unmounts before the network request completes, preventing memory leaks and state updates on unmounted components.

### 2. Search Optimization (`useCallback` and `useMemo`)
- **`useCallback` on Search Handler**:
  ```tsx
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);
  ```
  Provides a stable function reference across re-renders.
- **`useMemo` for Filtered Photos**:
  ```tsx
  const filteredPhotos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return photos;
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query)
    );
  }, [photos, searchQuery]);
  ```
  Only recalculates the filtered list when either `photos` or `searchQuery` changes, avoiding unnecessary array iterations during unrelated renders.

### 3. Favourites State with `useReducer` & `localStorage`
- **Predictable State Transitions**: Using `useReducer` centralizes state mutations (`TOGGLE_FAVOURITE`) into a pure reducer function rather than scattering state setters across event handlers.
- **Lazy Initialization**:
  ```tsx
  const [favourites, dispatch] = useReducer(favouritesReducer, [], getInitialFavourites);
  ```
  Passing `getInitialFavourites` as the third parameter ensures `localStorage` is only accessed synchronously on initial mount, avoiding expensive I/O operations on every subsequent render.
- **Persistence**: When toggled, the updated ID list is written to `localStorage`, so user choices persist across browser refreshes.

### 4. Responsive CSS Grid with Tailwind
- Mobile: `grid-cols-1`
- Tablet: `sm:grid-cols-2`
- Desktop: `lg:grid-cols-4`
- Aspect ratio (`aspect-4/3`) ensures consistent card geometry without layout shifts.
