import { TemplateSwitcher } from './TemplateSwitcher';
import { BuilderSidebar } from './BuilderSidebar';
import { ResumePreview } from '../../../components/builder/ResumePreview';
import { AIActionPanel } from '../../../components/builder/AIActionPanel';
import { ExportPanel } from '../../../components/builder/ExportPanel';

export const BuilderShell = ({
  resume, skillsText, achievementsText, actions, onDragEnd,
  resumeId, premium, onExported, onBlockedExport, refreshStatuses, autoSaveLabel,
}) => (
  <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
    {/* Editor column */}
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Builder</p>
            <h2 className="mt-1 text-base font-semibold text-slate-950">
              Drag to reorder · Switch templates · Edit inline
            </h2>
          </div>
          <div className="space-y-1.5">
            <TemplateSwitcher value={resume.templateId} onChange={actions.setTemplateId} />
            {autoSaveLabel && <p className="text-right text-[10px] text-slate-500">{autoSaveLabel}</p>}
          </div>
        </div>
      </div>

      <BuilderSidebar
        resume={resume}
        skillsText={skillsText}
        achievementsText={achievementsText}
        actions={actions}
        onDragEnd={onDragEnd}
      />
    </div>

    {/* Preview + actions column */}
    <div className="space-y-5">
      <ResumePreview resume={resume} />
      <AIActionPanel resume={resume} setResume={actions.setResumeCompat} />
      <ExportPanel
        resumeId={resumeId}
        premium={premium}
        onBlocked={onBlockedExport}
        onExported={onExported}
        refreshStatuses={refreshStatuses}
      />
    </div>
  </div>
);
