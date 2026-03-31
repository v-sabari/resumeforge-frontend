import { Link } from 'react-router-dom';
import { prettyDate } from '../../utils/helpers';

export const ResumeListCard = ({ resume, onDelete }) => {
  const title = resume?.title || resume?.fullName || 'Untitled Resume';
  const updatedAt = resume?.updatedAt || resume?.updated_at || resume?.createdAt;

  return (
    <div className="card p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">Last updated {prettyDate(updatedAt)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={`/app/builder/${resume.id || resume._id}`} className="btn-secondary">
            Open builder
          </Link>
          <button type="button" className="btn-secondary border-rose-200 text-rose-600 hover:border-rose-300 hover:text-rose-700" onClick={() => onDelete(resume.id || resume._id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
