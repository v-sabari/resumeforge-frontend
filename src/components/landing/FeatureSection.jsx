import { SectionContainer } from '../ui/SectionContainer';
import { Card } from '../ui/Card';

const FEATURES = [
  { icon: '⌘', title: 'Guided resume workspace',   desc: 'Structured sections, clear labels, and a deliberate editing flow — never overwhelming, always purposeful.' },
  { icon: '◉', title: 'Real-time ATS preview',      desc: 'Every update reflects instantly so you maintain recruiter-friendly formatting throughout.' },
  { icon: '✦', title: 'AI writing assistance',       desc: 'Improve summaries, generate stronger bullets, rewrite professionally, and surface relevant skills.' },
  { icon: '⬡', title: 'Payment-aware exports',       desc: 'Existing export and premium logic stays intact while the upgrade journey feels cleaner.' },
  { icon: '▦', title: 'Dashboard for iteration',     desc: 'Manage resume versions, check plan status, and jump back into editing without losing your place.' },
  { icon: '◈', title: 'Fully responsive quality',    desc: 'Works seamlessly across mobile, tablet, laptop, and desktop — no broken layouts anywhere.' },
];

export const FeatureSection = () => (
  <SectionContainer id="features">
    <div className="mx-auto max-w-2xl">
      <p className="kicker">Why ResumeForge AI</p>
      <h2 className="section-heading mt-3">
        Everything you need to get the interview.
      </h2>
      <p className="mt-4 text-lg leading-8 text-slate-600">
        The interface is calm, modern, and dependable. From first draft to final export, the product keeps the
        same routes, backend integrations, and monetisation mechanics — while the frontend becomes far more aligned,
        responsive, and easy to trust on any device.
      </p>
    </div>

    <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {FEATURES.map((f, i) => (
        <Card key={f.title} hover className={`flex flex-col p-6 animate-fade-up delay-${Math.min(i * 75, 300)}`}>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-base text-slate-700">
            {f.icon}
          </div>
          <h3 className="text-base font-semibold text-slate-950">{f.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{f.desc}</p>
        </Card>
      ))}
    </div>

    <div className="mt-8 grid gap-6 xl:grid-cols-2">
      <Card hover className="p-7 sm:p-8">
        <p className="kicker">Built for real job searches</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-950">Write once, tailor often, keep every version organised.</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          A marketing role may need sharper growth metrics, a product role cleaner project language, and a design role
          stronger storytelling. Instead of rewriting from scratch each time, duplicate, refine, preview, and export from
          a single workspace that keeps everything together and in sync.
        </p>
      </Card>
      <Card hover className="p-7 sm:p-8">
        <p className="kicker">Designed for trust</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-950">Every screen focuses on clarity, hierarchy, and confidence.</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Premium SaaS products earn trust through consistency — aligned cards, predictable spacing, strong focus states,
          readable typography, and clear empty, loading, and error states. This redesign delivers all of that while
          preserving the flows that already work behind the scenes.
        </p>
      </Card>
    </div>
  </SectionContainer>
);
