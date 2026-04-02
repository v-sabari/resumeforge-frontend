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
    <div className="flex flex-wrap justify-end gap-2">
      <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={() => actions.toggleSectionCollapsed(section)}>
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>
      {section === 'experience' ? <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={actions.addExperience}>Add</button> : null}
      {section === 'education' ? <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={actions.addEducation}>Add</button> : null}
      {section === 'projects' ? <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={actions.addProject}>Add</button> : null}
      {section === 'certifications' ? <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={actions.addCertification}>Add</button> : null}
      <button type="button" className="btn-secondary cursor-grab px-3 py-2 text-xs active:cursor-grabbing" {...dragHandleProps}>
        Drag
      </button>
    </div>
  );

  return (
    <SectionCard
      title={SECTION_LABELS[section]}
      description={sectionDescriptions[section]}
      actions={cardActions}
    >
      {isCollapsed ? <p className="text-sm text-slate-500">Section collapsed.</p> : null}
      {!isCollapsed && section === 'personalInfo' ? <PersonalInfoForm resume={resume} updateTopField={actions.updateTopField} /> : null}
      {!isCollapsed && section === 'summary' ? <SummaryForm value={resume.summary} onChange={(value) => actions.updateTopField('summary', value)} /> : null}
      {!isCollapsed && section === 'skills' ? <SkillsForm value={skillsText} onChange={actions.onSkillsTextChange} /> : null}
      {!isCollapsed && section === 'experience' ? <ExperienceSectionEditor resume={resume} updateArrayItem={actions.updateArrayItem} removeItem={actions.removeItem} /> : null}
      {!isCollapsed && section === 'education' ? <EducationSectionEditor resume={resume} updateArrayItem={actions.updateArrayItem} removeItem={actions.removeItem} /> : null}
      {!isCollapsed && section === 'projects' ? <ProjectsSectionEditor resume={resume} updateArrayItem={actions.updateArrayItem} removeItem={actions.removeItem} /> : null}
      {!isCollapsed && section === 'certifications' ? <CertificationsSectionEditor resume={resume} updateArrayItem={actions.updateArrayItem} removeItem={actions.removeItem} /> : null}
      {!isCollapsed && section === 'achievements' ? <AchievementsSectionEditor value={achievementsText} onChange={actions.onAchievementsTextChange} /> : null}
    </SectionCard>
  );
};
