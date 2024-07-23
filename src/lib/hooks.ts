import { useState, useEffect, useContext } from 'react';
import { TJobItemExpanded, TJobItems } from './type';
import { BASE_API_URL } from './constants';
import { useQueries, useQuery } from '@tanstack/react-query';
import { handleError } from './utils';
import { BookmarkContext } from '../contexts/BookmarkContextProvider';

type JobItemApiResponse = {
  public: boolean;
  jobItem: TJobItemExpanded;
};

type JobItemsApiResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: TJobItems[];
};

// ----------------------------------------------------- //
const fetchJobItem = async (id: number): Promise<JobItemApiResponse> => {
  const response = await fetch(`${BASE_API_URL}/${id}`);
  // 4xx or 5xx
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }

  const data = await response.json();
  return data;
};

// ----------------------------------------------------- //
const fetchJobItems = async (
  searchText: string
): Promise<JobItemsApiResponse> => {
  const response = await fetch(`${BASE_API_URL}?search=${searchText}`);
  // 4xx or 5xx
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }

  const data = await response.json();
  return data;
};

// ----------------------------------------------------- //
export const useJobItem = (id: number | null) => {
  const { data, isInitialLoading } = useQuery(
    ['job-item', id],
    () => (id ? fetchJobItem(id) : null),
    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: handleError,
    }
  );

  return {
    jobItem: data?.jobItem,
    isLoading: isInitialLoading,
  } as const;
};

export const useJobItems = (ids: number[]) => {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['job-item', id],
      queryFn: () => fetchJobItem(id),
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: handleError,
    })),
  });

  const jobItems = results
    .map((result) => result.data?.jobItem)
    .filter((jobItem) => jobItem !== undefined);
  const isLoading = results.some((results) => results.isLoading);

  return {
    jobItems,
    isLoading,
  } as const;
};

// ----------------------------------------------------- //
export const useSearchQuery = (searchText: string) => {
  const { data, isInitialLoading } = useQuery(
    ['job-items', searchText],
    () => fetchJobItems(searchText),
    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(searchText),
      onError: handleError,
    }
  );

  return {
    jobItems: data?.jobItems,
    isLoading: isInitialLoading,
  } as const;
};

// ----------------------------------------------------- //
export const useActiveId = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const id = +window.location.hash.slice(1);
      setActiveId(id);
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return activeId;
};

// ----------------------------------------------------- //
export const useDebounce = <T>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
};

// ----------------------------------------------------- //
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState(() =>
    JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue))
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
};

// ----------------------------------------------------- //
export const useOnClickOutside = (
  refs: React.RefObject<HTMLElement>[],
  handler: () => void
) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (refs.every((ref) => !ref.current?.contains(e.target as Node))) {
        handler();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [refs, handler]);
};

// ----------------------------------------------------- //
export const useBookmarksContext = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error(
      'useBookmarksContext must be used within a BookmarsContextProvider'
    );
  }

  return context;
};
