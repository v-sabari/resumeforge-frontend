export const AchievementsSectionEditor = ({ value, onChange }) => (
  <div>
    <label className="label">Achievements (one per line)</label>
    <textarea className="input min-h-28 resize-y" value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Speaker at SaaS Design Summit 2024 on scalable systems thinking." />
  </div>
);
