export const SummaryForm = ({ value, onChange }) => (
  <div>
    <label className="label">Summary</label>
    <textarea className="input min-h-40" value={value || ''} onChange={(event) => onChange(event.target.value)} />
  </div>
);
