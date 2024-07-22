import { BookmarkFilledIcon } from '@radix-ui/react-icons';
import { useContext } from 'react';
import { BookmarkContext } from '../contexts/BookmarkContextProvider';

type BookmarkIconProps = {
  id: number;
};

export default function BookmarkIcon({ id }: BookmarkIconProps) {
  const { bookmarkedIds, handleToggleBookmark } = useContext(BookmarkContext);

  return (
    <button
      onClick={(e) => {
        handleToggleBookmark(id);
        e.stopPropagation();
        e.preventDefault();
      }}
      className="bookmark-btn"
    >
      <BookmarkFilledIcon
        className={`${bookmarkedIds.includes(id) ? 'filled' : ''}`}
      />
    </button>
  );
}
