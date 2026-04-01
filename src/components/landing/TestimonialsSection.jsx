import { SectionContainer } from '../ui/SectionContainer';
import { Card } from '../ui/Card';

const testimonials = [
  {
    name: 'Nisha Rao',
    role: 'Growth Marketer',
    quote: 'The AI rewriting tools helped me sound clearer and more senior without making my resume feel generic.',
  },
  {
    name: 'Rohan Das',
    role: 'Frontend Engineer',
    quote: 'The live preview made it easy to keep everything ATS-friendly while still looking polished and modern.',
  },
  {
    name: 'Priya Kulkarni',
    role: 'Customer Success Lead',
    quote: 'I unlocked the first export, upgraded later, and never felt lost in the product flow. It feels simple in the best way.',
  },
];

export const TestimonialsSection = () => (
  <SectionContainer>
    <div className="max-w-3xl">
      <p className="kicker">Loved by applicants</p>
      <h2 className="section-heading mt-4">The experience feels modern, but the workflow stays practical.</h2>
    </div>
    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {testimonials.map((item) => (
        <Card key={item.name} className="flex h-full flex-col p-6" hover>
          <p className="text-base leading-8 text-slate-700">“{item.quote}”</p>
          <div className="mt-auto pt-6">
            <p className="font-semibold text-slate-950">{item.name}</p>
            <p className="text-sm text-slate-500">{item.role}</p>
          </div>
        </Card>
      ))}
    </div>
  </SectionContainer>
);
