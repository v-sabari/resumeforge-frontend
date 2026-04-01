import { SectionContainer } from '../ui/SectionContainer';
import { Card } from '../ui/Card';

const features = [
  {
    icon: '⌘',
    title: 'Guided resume workspace',
    description: 'Structured sections with clear labels and a deliberate writing flow — never overwhelming, always purposeful.',
  },
  {
    icon: '◎',
    title: 'Real-time ATS preview',
    description: 'Every update reflects instantly so you maintain recruiter-friendly formatting throughout the editing process.',
  },
  {
    icon: '✦',
    title: 'AI writing assistance',
    description: 'Improve summaries, generate stronger bullets, rewrite professionally, and surface skills — all in context.',
  },
  {
    icon: '⬡',
    title: 'Payment-aware exports',
    description: 'Keep the existing export and premium logic intact while presenting the upgrade path in a clear, clean way.',
  },
  {
    icon: '◈',
    title: 'Dashboard for iteration',
    description: 'Manage multiple resume versions, check plan status, and jump back into editing without losing your progress.',
  },
  {
    icon: '⊞',
    title: 'Responsive quality',
    description: 'Smooth across mobile, tablet, laptop, and desktop — no broken layouts or awkward spacing anywhere.',
  },
];

export const FeatureSection = () => (
  <SectionContainer id="features">
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">Why ResumeForge AI</p>
      <h2 className="section-heading mt-3">
        Everything you need to land the interview
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600">
        A premium interface that feels calm, modern, and dependable — built to reduce friction from first draft to final export, while keeping the same backend integrations and monetization mechanics.
      </p>
    </div>

    {/* Feature grid */}
    <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {features.map((feature, i) => (
        <div key={feature.title}
          className={`card card-hover flex flex-col p-6 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-700">
            {feature.icon}
          </div>
          <h3 className="text-base font-semibold text-slate-950">{feature.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
        </div>
      ))}
    </div>

    {/* Two deeper feature cards */}
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <Card className="p-7 sm:p-8" hover>
        <p className="eyebrow">Built for real job searches</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-950">Write once, tailor often, keep every version organised.</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          A marketing role may need sharper growth metrics, a product role cleaner project language, a design role stronger storytelling. Instead of rewriting from scratch, duplicate, refine, preview, and export from a single workspace that keeps everything together.
        </p>
      </Card>

      <Card className="p-7 sm:p-8" hover>
        <p className="eyebrow">Designed for trust</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-950">Every screen focuses on clarity, hierarchy, and confidence.</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Premium SaaS products earn trust through consistency — aligned cards, predictable spacing, strong focus states, readable typography, and clear empty, loading, and error states. This redesign brings those details in while preserving the flows that already work behind the scenes.
        </p>
      </Card>
    </div>
  </SectionContainer>
);
