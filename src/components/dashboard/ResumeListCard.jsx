import { Link } from 'react-router-dom';
import { prettyDate } from '../../utils/helpers';
import { Icon } from '../icons/Icon';

export const ResumeListCard = ({ resume, onDelete }) => {
  const title = resume?.title || resume?.fullName || 'Untitled Resume';
  const updatedAt = resume?.updatedAt || resume?.updated_at || resume?.createdAt;

  return (
    <div className="card p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Updated {prettyDate(updatedAt)}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-500">
            {resume.professionalTitle ? <span>{resume.professionalTitle}</span> : null}
            {resume.location ? <span>• {resume.location}</span> : null}
            <span>• {resume.skills?.length || 0} skills</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to={`/app/builder/${resume.id || resume._id}`} className="btn-secondary">
            <Icon name="builder" className="h-4 w-4" />
            Open builder
          </Link>
          <button type="button" className="btn-secondary border-rose-200 text-rose-600 hover:border-rose-300 hover:text-rose-700" onClick={() => onDelete(resume.id || resume._id)}>
            <Icon name="trash" className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
