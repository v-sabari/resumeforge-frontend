export const TemplateSwitcher = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {[
      { id: 'classic', label: 'Classic' },
      { id: 'modern', label: 'Modern' },
    ].map((template) => (
      <button
        key={template.id}
        type="button"
        onClick={() => onChange(template.id)}
        className={value === template.id ? 'btn-primary' : 'btn-secondary'}
      >
        {template.label}
      </button>
    ))}
  </div>
);
