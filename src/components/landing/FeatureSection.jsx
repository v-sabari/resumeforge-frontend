import { SectionContainer } from '../ui/SectionContainer';
import { Card } from '../ui/Card';

const features = [
  {
    title: 'Guided resume workspace',
    description: 'Edit with structured sections, clear labels, and a practical writing flow that feels deliberate rather than overwhelming.',
  },
  {
    title: 'Real-time ATS preview',
    description: 'See every update reflected instantly so you can improve readability and maintain recruiter-friendly formatting.',
  },
  {
    title: 'AI writing assistance',
    description: 'Improve summaries, generate stronger bullets, rewrite copy professionally, and surface useful skills in context.',
  },
  {
    title: 'Payment-aware export flow',
    description: 'Keep the existing export and premium logic intact while presenting the upgrade journey in a clearer, cleaner way.',
  },
  {
    title: 'Dashboard built for iteration',
    description: 'Manage multiple resume versions, check plan status, and jump back into editing without losing your place.',
  },
  {
    title: 'Responsive product quality',
    description: 'Designed to work smoothly across mobile, tablet, laptop, and desktop without broken layouts or awkward spacing.',
  },
];

export const FeatureSection = () => (
  <SectionContainer id="features">
    <div className="max-w-3xl">
      <p className="kicker">Why ResumeForge AI</p>
      <h2 className="section-heading mt-4">A premium frontend redesign that keeps the product logic stable and the UI consistently aligned.</h2>
      <p className="mt-5 text-lg leading-8 text-slate-600">
        The interface is intentionally structured to feel calm, modern, and dependable. Candidates can move from first draft to final export with less friction, while the product keeps the same routes, backend integrations, and monetization mechanics already powering the app.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="flex h-full flex-col p-6" hover>
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 shadow-sm">✦</div>
          <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
        </Card>
      ))}
    </div>

    <div className="mt-12 grid gap-6 xl:grid-cols-2">
      <Card className="h-full p-6 sm:p-8" hover>
        <p className="kicker">Built for real job searches</p>
        <h3 className="mt-4 text-2xl font-semibold text-slate-950">Write once, tailor often, and keep every version organized.</h3>
        <p className="mt-4 text-sm leading-8 text-slate-600">
          ResumeForge AI is useful when candidates need to move quickly across multiple applications. A marketing role may need sharper growth metrics, a product role may need cleaner project language, and a design role may need stronger storytelling. Instead of rewriting from scratch each time, users can duplicate, refine, preview, and export from a single workspace that keeps everything together.
        </p>
      </Card>
      <Card className="h-full p-6 sm:p-8" hover>
        <p className="kicker">Designed for trust</p>
        <h3 className="mt-4 text-2xl font-semibold text-slate-950">Every screen focuses on clarity, hierarchy, and next-step confidence.</h3>
        <p className="mt-4 text-sm leading-8 text-slate-600">
          Premium SaaS products earn trust through consistency. That means aligned cards, predictable spacing, strong focus states, readable typography, and clear empty, loading, and error states. This redesign brings those details into the product while preserving the flows that already work behind the scenes.
        </p>
      </Card>
    </div>
  </SectionContainer>
);
