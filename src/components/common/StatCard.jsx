export const StatCard = ({ label, value, helper }) => (
  <div className="card p-5">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
    {helper ? <p className="mt-2 text-sm text-slate-600">{helper}</p> : null}
  </div>
);
