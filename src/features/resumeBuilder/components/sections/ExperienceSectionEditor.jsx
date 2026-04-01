export const ExperienceSectionEditor = ({ resume, updateArrayItem, removeItem }) => (
  <div className="space-y-4">
    {(resume.experience || []).map((item) => (
      <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <div className="mb-3 flex justify-end">
          <button type="button" className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            onClick={() => removeItem('experience', item.id)}>Remove</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[['role','Role'],['company','Company'],['startDate','Start date'],['endDate','End date'],['location','Location']].map(([field, label]) => (
            <div key={field} className={field === 'location' ? 'sm:col-span-2' : ''}>
              <label className="label">{label}</label>
              <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('experience', item.id, field, e.target.value)} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="label">Bullets (one per line)</label>
            <textarea className="input min-h-28 resize-y" value={(item.bullets || []).join('\n')}
              onChange={(e) => updateArrayItem('experience', item.id, 'bullets', e.target.value.split('\n').map((l) => l.trim()).filter(Boolean))} />
          </div>
        </div>
      </div>
    ))}
  </div>
);
