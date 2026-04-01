export const ExperienceSectionEditor = ({ resume, updateArrayItem, removeItem }) => (
  <div className="space-y-5">
    {(resume.experience || []).map((item) => (
      <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
        <div className="mb-4 flex justify-end">
          <button type="button" className="text-sm font-medium text-rose-600" onClick={() => removeItem('experience', item.id)}>Remove</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['role', 'Role'],
            ['company', 'Company'],
            ['startDate', 'Start date'],
            ['endDate', 'End date'],
            ['location', 'Location'],
          ].map(([field, label]) => (
            <div key={field} className={field === 'location' ? 'md:col-span-2' : ''}>
              <label className="label">{label}</label>
              <input className="input" value={item[field] || ''} onChange={(event) => updateArrayItem('experience', item.id, field, event.target.value)} />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="label">Bullets (one per line)</label>
            <textarea className="input min-h-32" value={(item.bullets || []).join('\n')} onChange={(event) => updateArrayItem('experience', item.id, 'bullets', event.target.value.split('\n').map((line) => line.trim()).filter(Boolean))} />
          </div>
        </div>
      </div>
    ))}
  </div>
);
