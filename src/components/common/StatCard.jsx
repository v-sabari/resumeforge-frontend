export const StatCard = ({ label, value, helper }) => (
  <div className="card p-5">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
    <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    {helper ? <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p> : null}
  </div>
);
