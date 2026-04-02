export const SkillsForm = ({ value, onChange }) => (
  <div>
    <label className="label">Skills (comma-separated)</label>
    <input className="input" value={value} onChange={(e) => onChange(e.target.value)}
      placeholder="React, TypeScript, Figma, Leadership" />
  </div>
);
