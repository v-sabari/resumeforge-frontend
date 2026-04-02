import { Link } from 'react-router-dom';
import { prettyDate } from '../../utils/helpers';
import { Icon } from '../icons/Icon';

export const ResumeListCard = ({ resume, onDelete }) => {
  const title = resume?.title || resume?.fullName || 'Untitled Resume';
  const updatedAt = resume?.updatedAt || resume?.updated_at || resume?.createdAt;

  return (
    <div className="card card-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold text-slate-950">{title}</h3>
          {updatedAt && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-500">
              {prettyDate(updatedAt)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          {resume.professionalTitle && <span>{resume.professionalTitle}</span>}
          {resume.location && <span>· {resume.location}</span>}
          <span>· {resume.skills?.length || 0} skills</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link to={`/app/builder/${resume.id || resume._id}`} className="btn-secondary text-xs py-2">
          <Icon name="builder" className="h-3.5 w-3.5" />
          Open
        </Link>
        <button type="button"
          className="btn-secondary border-rose-100 text-rose-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 text-xs py-2"
          onClick={() => onDelete(resume.id || resume._id)}>
          <Icon name="trash" className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
};
