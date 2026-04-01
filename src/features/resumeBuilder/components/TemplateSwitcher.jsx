export const TemplateSwitcher = ({ value, onChange }) => (
  <div className="flex gap-2">
    {[{ id: 'classic', label: 'Classic' }, { id: 'modern', label: 'Modern' }].map((t) => (
      <button key={t.id} type="button"
        onClick={() => onChange(t.id)}
        className={value === t.id ? 'btn-primary text-xs py-2 px-4' : 'btn-secondary text-xs py-2 px-4'}>
        {t.label}
      </button>
    ))}
  </div>
);
