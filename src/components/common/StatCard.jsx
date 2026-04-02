export const StatCard = ({ label, value, helper }) => (
  <div className="card flex h-full flex-col p-5">
    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
    <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
    {helper && <p className="mt-1.5 text-xs leading-5 text-slate-500">{helper}</p>}
  </div>
);
