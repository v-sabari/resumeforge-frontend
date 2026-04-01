import { SortableSectionList } from './SortableSectionList';

export const BuilderSidebar = ({ resume, skillsText, achievementsText, actions, onDragEnd }) => (
  <SortableSectionList
    sections={resume.sectionOrder || []}
    resume={resume}
    skillsText={skillsText}
    achievementsText={achievementsText}
    actions={actions}
    onDragEnd={onDragEnd}
  />
);
