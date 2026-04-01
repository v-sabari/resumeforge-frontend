import { Link } from 'react-router-dom';
import { prettyDate } from '../../utils/helpers';
import { Icon } from '../icons/Icon';

export const ResumeListCard = ({ resume, onDelete }) => {
  const title = resume?.title || resume?.fullName || 'Untitled Resume';
  const updatedAt = resume?.updatedAt || resume?.updated_at || resume?.createdAt;

  return (
<<<<<<< HEAD
    <div className="card px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Updated {prettyDate(updatedAt)}
            </span>
=======
    <div className="card card-hover p-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Updated {prettyDate(updatedAt)}</span>
>>>>>>> 488aee9d81e8e5f13867ea09e09bb01bb4567075
          </div>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm text-slate-500">
            {resume.professionalTitle ? <span>{resume.professionalTitle}</span> : null}
            {resume.location ? <span>{resume.location}</span> : null}
            <span>{resume.skills?.length || 0} skills</span>
          </div>
        </div>

<<<<<<< HEAD
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[280px]">
          <Link to={`/app/builder/${resume.id || resume._id}`} className="btn-secondary h-12 w-full justify-center">
            <Icon name="builder" className="h-4 w-4" />
            Open builder
          </Link>
          <button
            type="button"
            className="btn-secondary h-12 w-full justify-center border-rose-200 text-rose-600 hover:border-rose-300 hover:text-rose-700"
            onClick={() => onDelete(resume.id || resume._id)}
          >
=======
        <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap">
          <Link to={`/app/builder/${resume.id || resume._id}`} className="btn-secondary w-full justify-center xl:w-auto">
            <Icon name="builder" className="h-4 w-4" />
            Open builder
          </Link>
          <button type="button" className="btn-secondary w-full justify-center border-rose-200 text-rose-600 hover:border-rose-300 hover:text-rose-700 xl:w-auto" onClick={() => onDelete(resume.id || resume._id)}>
>>>>>>> 488aee9d81e8e5f13867ea09e09bb01bb4567075
            <Icon name="trash" className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
