import { useActiveIdContext } from '../lib/hooks';
import { TJobItems } from '../lib/type';
import JobListItem from './JobListItem';
import Spinner from './Spinner';

type JobListProps = {
  jobItems: TJobItems[];
  isLoading: boolean;
};

export function JobList({ jobItems, isLoading }: JobListProps) {
  const { activeId } = useActiveIdContext();

  return (
    <ul className="job-list">
      {isLoading && <Spinner />}

      {!isLoading &&
        jobItems.map((jobItem) => (
          <JobListItem
            key={jobItem.id}
            jobItem={jobItem}
            isActive={jobItem.id === activeId}
          />
        ))}
    </ul>
  );
}

export default JobList;
