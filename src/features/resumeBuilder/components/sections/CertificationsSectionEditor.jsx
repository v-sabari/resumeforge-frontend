export const CertificationsSectionEditor = ({ resume, updateArrayItem, removeItem }) => (
  <div className="space-y-5">
    {(resume.certifications || []).map((item) => (
      <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
        <div className="mb-4 flex justify-end">
          <button type="button" className="text-sm font-medium text-rose-600" onClick={() => removeItem('certifications', item.id)}>Remove</button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['name', 'Certification'],
            ['issuer', 'Issuer'],
            ['year', 'Year'],
          ].map(([field, label]) => (
            <div key={field}>
              <label className="label">{label}</label>
              <input className="input" value={item[field] || ''} onChange={(event) => updateArrayItem('certifications', item.id, field, event.target.value)} />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
