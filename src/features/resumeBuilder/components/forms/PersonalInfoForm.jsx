export const PersonalInfoForm = ({ resume, updateTopField }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {[['fullName','Full name'],['professionalTitle','Professional title'],['email','Email'],['phone','Phone'],['location','Location'],['linkedin','LinkedIn'],['github','GitHub'],['portfolio','Portfolio']].map(([field, label]) => (
      <div key={field} className={field === 'portfolio' ? 'sm:col-span-2' : ''}>
        <label className="label">{label}</label>
        <input className="input" value={resume[field] || ''} onChange={(e) => updateTopField(field, e.target.value)} />
      </div>
    ))}
  </div>
);
