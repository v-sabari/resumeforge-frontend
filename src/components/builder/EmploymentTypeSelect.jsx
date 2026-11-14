/**
 * PHASE-2b: EmploymentTypeSelect
 *
 * Replaces the free-text "Employment type" input in the Experience section
 * with a <select>. The options match the brief: Full-time, Part-time,
 * Contract, Internship, Freelance, Other. An empty "—" option is included
 * so the user can clear the value (the field is optional).
 *
 * The stored value is the same string the templates already render, so no
 * template changes are needed.
 */

const OPTIONS = [
  { value: '',            label: '—' },
  { value: 'Full-time',   label: 'Full-time' },
  { value: 'Part-time',   label: 'Part-time' },
  { value: 'Contract',    label: 'Contract' },
  { value: 'Internship',  label: 'Internship' },
  { value: 'Freelance',   label: 'Freelance' },
  { value: 'Other',       label: 'Other' },
];

export const EmploymentTypeSelect = ({ id, label, value, onChange }) => (
  <div className="space-y-1.5">
    {label && <label className="label" htmlFor={id}>{label}</label>}
    <select
      id={id}
      className="input"
      value={value || ''
      }
      onChange={(e) => onChange(e.target.value)}
      aria-label={label || 'Employment type'}
    >
      {OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export default EmploymentTypeSelect;
