import { TemplateSwitcher } from './TemplateSwitcher';
import { BuilderSidebar } from './BuilderSidebar';
import { ResumePreview } from '../../../components/builder/ResumePreview';
import { AIActionPanel } from '../../../components/builder/AIActionPanel';
import { ExportPanel } from '../../../components/builder/ExportPanel';

export const BuilderShell = ({
  resume,
  skillsText,
  achievementsText,
  actions,
  onDragEnd,
  resumeId,
  premium,
  onExported,
  onBlockedExport,
  refreshStatuses,
  autoSaveLabel,
}) => (
  <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
    <div className="space-y-6">
      <div className="card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Builder workflow</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-950">FlowCV-style split builder, aligned to ResumeForge AI</h3>
            <p className="mt-2 text-sm text-slate-600">Drag sections to reorder, collapse sections while editing, and switch templates instantly.</p>
          </div>
          <div className="space-y-2">
            <TemplateSwitcher value={resume.templateId} onChange={actions.setTemplateId} />
            <p className="text-right text-xs text-slate-500">{autoSaveLabel}</p>
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

    <div className="space-y-6">
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
