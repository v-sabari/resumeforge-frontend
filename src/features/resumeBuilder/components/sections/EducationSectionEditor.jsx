export const EducationSectionEditor = ({ resume, updateArrayItem, removeItem }) => (
  <div className="space-y-4">
    {(resume.education || []).map((item) => (
      <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <div className="mb-3 flex justify-end">
          <button type="button" className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            onClick={() => removeItem('education', item.id)}>Remove</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[['institution','Institution'],['degree','Degree'],['startDate','Start year'],['endDate','End year'],['location','Location']].map(([field, label]) => (
            <div key={field} className={field === 'location' ? 'sm:col-span-2' : ''}>
              <label className="label">{label}</label>
              <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('education', item.id, field, e.target.value)} />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
