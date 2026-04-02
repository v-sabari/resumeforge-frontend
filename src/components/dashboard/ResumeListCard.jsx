import { Link } from 'react-router-dom';
import { prettyDate } from '../../utils/helpers';
import { Icon } from '../icons/Icon';

export const ResumeListCard = ({ resume, onDelete }) => {
  const title     = resume?.title || resume?.fullName || 'Untitled Resume';
  const updatedAt = resume?.updatedAt || resume?.updated_at || resume?.createdAt;

  return (
    <div className="card-interactive card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Info */}
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold text-slate-950">{title}</h3>
          {updatedAt && (
            <span className="badge badge-neutral shrink-0">Updated {prettyDate(updatedAt)}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
          {resume.professionalTitle && <span>{resume.professionalTitle}</span>}
          {resume.location && <span>· {resume.location}</span>}
          <span>· {resume.skills?.length || 0} skills</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <Link to={`/app/builder/${resume.id || resume._id}`} className="btn-secondary gap-1.5 text-xs py-2 px-3">
          <Icon name="builder" className="h-3.5 w-3.5" />
          Open
        </Link>
        <button
          type="button"
          onClick={() => onDelete(resume.id || resume._id)}
          className="btn-danger gap-1.5 text-xs py-2 px-3"
        >
          <Icon name="trash" className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
};
