import { useState } from 'react';
import { SectionContainer } from '../ui/SectionContainer';

const faqs = [
  {
    question: 'How does the free export work?',
    answer: 'Your first export is available on the free plan through the rewarded ad flow. Once completed successfully, the export is unlocked for that attempt according to backend-controlled rules.',
  },
  {
    question: 'What changes after I upgrade to Premium?',
    answer: 'Premium unlocks unlimited exports, removes the ad dependency, and gives you a smoother path for repeated job applications. All for a one-time payment of ₹99.',
  },
  {
    question: 'Is the premium state managed by the backend?',
    answer: 'Yes. The UI reads authenticated state, premium status, payment verification, and export permissions from the backend — not frontend-only assumptions. Your plan data is always accurate.',
  },
  {
    question: 'Can I save multiple resumes for different roles?',
    answer: 'Absolutely. The dashboard and builder support multiple saved resumes so you can tailor versions for specific applications while keeping a central, organised workspace.',
  },
  {
    question: 'Does the AI work with my existing resume content?',
    answer: 'Yes. The AI tools — summary improvement, bullet generation, professional rewriting, and skill suggestions — all use your current resume data as context for more relevant results.',
  },
  {
    question: 'What happens if a payment does not go through?',
    answer: 'If a payment does not complete or verify successfully, premium access will not be activated. You can re-attempt the payment from the pricing page or contact support for help.',
  },
];

const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-slate-50"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-900">{question}</span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 animate-fade-in">
          <p className="text-sm leading-7 text-slate-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

export const FaqSection = () => (
  <SectionContainer id="faq" className="pt-0 sm:pt-0">
    <div className="text-center">
      <p className="eyebrow">FAQ</p>
      <h2 className="section-heading mt-3">Common questions, answered.</h2>
      <p className="mt-4 text-base text-slate-600">Everything you need to know before you start building.</p>
    </div>
    <div className="mx-auto mt-12 max-w-3xl space-y-3">
      {faqs.map((item) => (
        <FaqItem key={item.question} {...item} />
      ))}
    </div>
  </SectionContainer>
);
