export const SummaryForm = ({ value, onChange }) => (
  <div>
    <label className="label">Summary</label>
    <textarea className="input min-h-36 resize-y" value={value || ''} onChange={(e) => onChange(e.target.value)}
      placeholder="Product designer with 7+ years building conversion-focused SaaS experiences..." />
  </div>
);
