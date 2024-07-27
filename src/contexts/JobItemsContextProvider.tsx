import { createContext, useCallback, useMemo, useState } from 'react';
import { useSearchQuery, useSearchTextContext } from '../lib/hooks';
import { RESULTS_PER_PAGE } from '../lib/constants';
import { TSortBy, TPageDirection, TJobItems } from '../lib/type';

type JobItemsContext = {
  jobItems: TJobItems[] | undefined;
  jobItemsSortedAndSliced: TJobItems[];
  isLoading: boolean;
  totalNumberOfResults: number;
  totalNumberOfPages: number;
  currentPage: number;
  sortBy: TSortBy;
  handleChangePage: (direction: TPageDirection) => void;
  handleChangeSortBy: (newSortBy: TSortBy) => void;
};

export const JobItemsContext = createContext<JobItemsContext | null>(null);

const JobItemsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // dependency and other context
  const { debouncedSearchText } = useSearchTextContext();

  // state
  const { jobItems, isLoading } = useSearchQuery(debouncedSearchText);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<TSortBy>('relevant');

  // derived / computed state
  const totalNumberOfResults = jobItems?.length || 0;
  const totalNumberOfPages = totalNumberOfResults / RESULTS_PER_PAGE;
  const jobItemsSorted = useMemo(
    () =>
      [...(jobItems || [])]?.sort((a, b) => {
        if (sortBy === 'relevant') {
          return b.relevanceScore - a.relevanceScore;
        } else {
          return a.daysAgo - b.daysAgo;
        }
      }),
    [sortBy, jobItems]
  );
  const jobItemsSortedAndSliced = useMemo(
    () =>
      jobItemsSorted.slice(
        currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
        currentPage * RESULTS_PER_PAGE
      ),
    [currentPage, jobItemsSorted]
  );

  // event handlers / actions
  const handleChangePage = useCallback(
    () => (direction: TPageDirection) => {
      if (direction === 'next') {
        setCurrentPage((prev) => prev + 1);
      } else if (direction === 'previous') {
        setCurrentPage((prev) => prev - 1);
      }
    },
    []
  );

  const handleChangeSortBy = useCallback(
    () => (newSortBy: TSortBy) => {
      setCurrentPage(1);
      setSortBy(newSortBy);
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      jobItems,
      jobItemsSortedAndSliced,
      isLoading,
      totalNumberOfResults,
      totalNumberOfPages,
      currentPage,
      sortBy,
      handleChangePage,
      handleChangeSortBy,
    }),
    [
      jobItems,
      jobItemsSortedAndSliced,
      isLoading,
      totalNumberOfResults,
      totalNumberOfPages,
      currentPage,
      sortBy,
      handleChangePage,
      handleChangeSortBy,
    ]
  );

  return (
    <JobItemsContext.Provider value={contextValue}>
      {children}
    </JobItemsContext.Provider>
  );
};

export default JobItemsContextProvider;
