import { createContext } from 'react';
import { useLocalStorage, useJobItems } from '../lib/hooks';

type BookmarksContext = {
  bookmarkedIds: number[];
  handleToggleBookmark: (id: number) => void;
};

export const BookmarkContext = createContext<BookmarksContext | null>(null);

const BookmarkContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [bookmarkedIds, setBookmarkedIds] = useLocalStorage<number[]>(
    'bookmarkedIds',
    []
  );

  const { jobItems: bookmarkedJobItems, isLoading } =
    useJobItems(bookmarkedIds);

  const handleToggleBookmark = (id: number) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setBookmarkedIds((prev) => [...prev, id]);
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedIds,
        handleToggleBookmark,
        bookmarkedJobItems,
        isLoading,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkContextProvider;
