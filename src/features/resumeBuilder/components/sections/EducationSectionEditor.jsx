export const EducationSectionEditor = ({ resume, updateArrayItem, removeItem }) => (
  <div className="space-y-5">
    {(resume.education || []).map((item) => (
      <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
        <div className="mb-4 flex justify-end">
          <button type="button" className="text-sm font-medium text-rose-600" onClick={() => removeItem('education', item.id)}>Remove</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['institution', 'Institution'],
            ['degree', 'Degree'],
            ['startDate', 'Start date'],
            ['endDate', 'End date'],
            ['location', 'Location'],
          ].map(([field, label]) => (
            <div key={field} className={field === 'location' ? 'md:col-span-2' : ''}>
              <label className="label">{label}</label>
              <input className="input" value={item[field] || ''} onChange={(event) => updateArrayItem('education', item.id, field, event.target.value)} />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
