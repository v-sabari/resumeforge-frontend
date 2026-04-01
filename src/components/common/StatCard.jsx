export const StatCard = ({ label, value, helper }) => (
  <div className="card card-hover flex h-full flex-col justify-between p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
    <div className="mt-4">
      <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      {helper ? <p className="mt-2 text-sm leading-7 text-slate-600">{helper}</p> : null}
    </div>
  </div>
);
