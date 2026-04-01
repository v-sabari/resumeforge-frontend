import { SectionContainer } from '../ui/SectionContainer';
import { Card } from '../ui/Card';

const faqs = [
  {
    question: 'How does the free export work?',
    answer: 'Your first export is gated behind a rewarded ad flow. Once completed successfully, the export is unlocked for that attempt according to the backend-controlled rules.',
  },
  {
    question: 'What changes after I upgrade?',
    answer: 'Premium unlocks unlimited exports, removes the ad dependency, and gives users a smoother path for repeated job applications.',
  },
  {
    question: 'Does the frontend rely on backend truth for premium and export access?',
    answer: 'Yes. The UI reads authenticated state, premium status, payment verification, and export permissions from the backend rather than using frontend-only assumptions.',
  },
  {
    question: 'Can I save multiple resumes for different roles?',
    answer: 'Yes. The dashboard and builder support multiple saved resumes so you can tailor versions for specific applications while keeping a central workspace.',
  },
];

export const FaqSection = () => (
  <SectionContainer id="faq" className="pt-0 sm:pt-0">
    <div className="text-center">
      <p className="kicker">FAQ</p>
      <h2 className="section-heading mt-4">Common questions before you build.</h2>
    </div>
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {faqs.map((item) => (
        <Card key={item.question} className="h-full p-6" hover>
          <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
        </Card>
      ))}
    </div>
  </SectionContainer>
);
