import { useState, createContext } from 'react';

export const BookmarkContext = createContext(null);

const BookmarkContextProvider = ({ children }) => {
  const [bookmarkIds, setBookmarkIds] = useState<number[]>([]);

  const handleToggleBookmark = (id: number) => {
    if (bookmarkIds.includes(id)) {
      setBookmarkIds((prev) => prev.filter((item) => item !== id));
    } else {
      setBookmarkIds((prev) => [...prev, id]);
    }
  };
  return (
    <BookmarkContext.Provider
      value={{
        bookmarkIds,
        handleToggleBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkContextProvider;
