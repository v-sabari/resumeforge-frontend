export const AchievementsSectionEditor = ({ value, onChange }) => (
  <div>
    <label className="label">Achievements (one per line)</label>
    <textarea className="input min-h-32" value={value} onChange={(event) => onChange(event.target.value)} />
  </div>
);
