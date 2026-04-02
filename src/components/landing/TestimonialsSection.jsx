import { SectionContainer } from '../ui/SectionContainer';
import { Card } from '../ui/Card';

const TESTIMONIALS = [
  { name: 'Nisha Rao',       role: 'Growth Marketer, Bangalore',       quote: 'The AI rewriting tools helped me sound clearer and more senior without making my resume feel generic. I got two interviews in the same week.' },
  { name: 'Rohan Das',       role: 'Frontend Engineer, Hyderabad',      quote: 'The live preview made it easy to keep everything ATS-friendly while still looking polished. I loved being able to see every change immediately.' },
  { name: 'Priya Kulkarni',  role: 'Customer Success Lead, Mumbai',     quote: 'I unlocked the first export, upgraded later, and never felt lost in the product flow. It feels simple in the best way — no unnecessary steps.' },
];

export const TestimonialsSection = () => (
  <SectionContainer className="pt-0 sm:pt-0">
    <div className="mx-auto max-w-xl">
      <p className="kicker">Loved by applicants</p>
      <h2 className="section-heading mt-3">The experience feels modern, the workflow stays practical.</h2>
    </div>
    <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {TESTIMONIALS.map((t) => (
        <Card key={t.name} hover className="flex flex-col p-6">
          <div className="mb-3 flex gap-0.5 text-amber-400">
            {'★★★★★'.split('').map((s, i) => <span key={i} className="text-sm">{s}</span>)}
          </div>
          <p className="flex-1 text-sm leading-7 text-slate-700">"{t.quote}"</p>
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-sm font-semibold text-slate-950">{t.name}</p>
            <p className="text-xs text-slate-500">{t.role}</p>
          </div>
        </Card>
      ))}
    </div>
  </SectionContainer>
);
