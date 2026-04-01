export const SkillsForm = ({ value, onChange }) => (
  <div>
    <label className="label">Skills</label>
    <input className="input" value={value} onChange={(event) => onChange(event.target.value)} />
  </div>
);
