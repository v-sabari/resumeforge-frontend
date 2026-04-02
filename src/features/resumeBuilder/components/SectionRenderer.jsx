import { SectionCard } from '../../../components/builder/SectionCard';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { SummaryForm } from './forms/SummaryForm';
import { SkillsForm } from './forms/SkillsForm';
import { ExperienceSectionEditor } from './sections/ExperienceSectionEditor';
import { EducationSectionEditor } from './sections/EducationSectionEditor';
import { ProjectsSectionEditor } from './sections/ProjectsSectionEditor';
import { CertificationsSectionEditor } from './sections/CertificationsSectionEditor';
import { AchievementsSectionEditor } from './sections/AchievementsSectionEditor';
import { SECTION_LABELS } from '../utils/sectionRegistry';

const sectionDescriptions = {
  personalInfo: 'Core identity and contact details for your resume header.',
  summary: 'Use a concise, impact-driven overview.',
  skills: 'Comma-separated skills are converted into resume tags.',
  experience: 'Add your most relevant work history.',
  education: 'Show academic credentials and location details.',
  projects: 'Highlight notable work, case studies, or shipped outcomes.',
  certifications: 'Add credentials that strengthen trust and relevance.',
  achievements: 'Capture standout wins, awards, or measurable impact.',
};

export const SectionRenderer = ({ section, resume, skillsText, achievementsText, actions, dragHandleProps = {} }) => {
  const isCollapsed = resume.sectionSettings?.[section]?.collapsed;

  const cardActions = (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn-ghost text-xs py-1.5 px-3"
        onClick={() => actions.toggleSectionCollapsed(section)}>
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>
      {section === 'experience' && <button type="button" className="btn-secondary text-xs py-1.5 px-3" onClick={actions.addExperience}>+ Add</button>}
      {section === 'education' && <button type="button" className="btn-secondary text-xs py-1.5 px-3" onClick={actions.addEducation}>+ Add</button>}
      {section === 'projects' && <button type="button" className="btn-secondary text-xs py-1.5 px-3" onClick={actions.addProject}>+ Add</button>}
      {section === 'certifications' && <button type="button" className="btn-secondary text-xs py-1.5 px-3" onClick={actions.addCertification}>+ Add</button>}
      <button type="button" className="btn-ghost cursor-grab text-xs py-1.5 px-3 active:cursor-grabbing" {...dragHandleProps}>
        ⠿ Drag
      </button>
    </div>
  );

  return (
    <SectionCard title={SECTION_LABELS[section]} description={sectionDescriptions[section]} actions={cardActions}>
      {isCollapsed ? (
        <p className="text-sm text-slate-500 italic">Section collapsed — click Expand to edit.</p>
      ) : (
        <>
          {section === 'personalInfo' && <PersonalInfoForm resume={resume} updateTopField={actions.updateTopField} />}
          {section === 'summary' && <SummaryForm value={resume.summary} onChange={(v) => actions.updateTopField('summary', v)} />}
          {section === 'skills' && <SkillsForm value={skillsText} onChange={actions.onSkillsTextChange} />}
          {section === 'experience' && <ExperienceSectionEditor resume={resume} updateArrayItem={actions.updateArrayItem} removeItem={actions.removeItem} />}
          {section === 'education' && <EducationSectionEditor resume={resume} updateArrayItem={actions.updateArrayItem} removeItem={actions.removeItem} />}
          {section === 'projects' && <ProjectsSectionEditor resume={resume} updateArrayItem={actions.updateArrayItem} removeItem={actions.removeItem} />}
          {section === 'certifications' && <CertificationsSectionEditor resume={resume} updateArrayItem={actions.updateArrayItem} removeItem={actions.removeItem} />}
          {section === 'achievements' && <AchievementsSectionEditor value={achievementsText} onChange={actions.onAchievementsTextChange} />}
        </>
      )}
    </SectionCard>
  );
};
