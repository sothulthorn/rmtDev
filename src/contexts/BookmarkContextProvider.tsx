import { useState, createContext, useEffect } from 'react';

export const BookmarkContext = createContext(null);

const BookmarkContextProvider = ({ children }) => {
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() =>
    JSON.parse(localStorage.getItem('bookmarkedIds') || '[]')
  );

  const handleToggleBookmark = (id: number) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setBookmarkedIds((prev) => [...prev, id]);
    }
  };

  useEffect(() => {
    localStorage.setItem('bookmarkedIds', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedIds,
        handleToggleBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkContextProvider;
