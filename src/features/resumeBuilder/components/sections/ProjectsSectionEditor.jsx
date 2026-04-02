export const ProjectsSectionEditor = ({ resume, updateArrayItem, removeItem }) => (
  <div className="space-y-5">
    {(resume.projects || []).map((item) => (
      <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
        <div className="mb-4 flex justify-end">
          <button type="button" className="text-sm font-medium text-rose-600" onClick={() => removeItem('projects', item.id)}>Remove</button>
        </div>
        <div className="grid gap-4">
          {[
            ['name', 'Project name'],
            ['link', 'Project link'],
          ].map(([field, label]) => (
            <div key={field}>
              <label className="label">{label}</label>
              <input className="input" value={item[field] || ''} onChange={(event) => updateArrayItem('projects', item.id, field, event.target.value)} />
            </div>
          ))}
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-28" value={item.description || ''} onChange={(event) => updateArrayItem('projects', item.id, 'description', event.target.value)} />
          </div>
        </div>
      </div>
    ))}
  </div>
);
