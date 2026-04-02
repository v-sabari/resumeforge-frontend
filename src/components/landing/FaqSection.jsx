import { useState } from 'react';
import { SectionContainer } from '../ui/SectionContainer';

const FAQS = [
  { q: 'How does the free export work?',
    a: 'Your first export is available through a rewarded ad flow on the free plan. Once completed, the export is unlocked for that attempt according to backend-controlled rules. No tricks — the UI simply reflects what the backend allows.' },
  { q: 'What changes after I upgrade to Premium?',
    a: 'Premium unlocks unlimited exports, removes the ad gate, and gives you a smoother application workflow. The one-time payment of ₹99 activates premium status on your backend account — the same status the frontend reads to control access.' },
  { q: 'Is my data safe with ResumeForge AI?',
    a: 'Your resume data, account credentials, and payment metadata are handled by the backend service and its integrated providers. The frontend only stores your auth token locally. We do not sell personal information. See the Privacy Policy for full details.' },
  { q: 'Can I save multiple resume versions for different roles?',
    a: 'Yes. The dashboard and builder support multiple saved resumes so you can maintain tailored versions for different applications without overwriting previous work.' },
  { q: 'How do the AI writing tools work?',
    a: 'AI actions — such as improving your summary, generating experience bullets, suggesting skills, or rewriting copy — all use your current resume content as context. They call your backend AI routes and apply the result directly to the relevant section.' },
  { q: 'What if my payment fails or is not activated?',
    a: 'If a payment does not complete or verify successfully, premium access will not be activated. You can retry from the Pricing page or contact support at support@resumeforge.ai for help resolving payment issues.' },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50">
        <span className="text-sm font-semibold text-slate-900">{q}</span>
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-3 animate-fade-up">
          <p className="text-sm leading-7 text-slate-600">{a}</p>
        </div>
      )}
    </div>
  );
};

export const FaqSection = () => (
  <SectionContainer id="faq" className="pt-0 sm:pt-0">
    <div className="mx-auto max-w-xl">
      <p className="kicker">FAQ</p>
      <h2 className="section-heading mt-3">Common questions answered.</h2>
      <p className="mt-4 text-base text-slate-600">Everything you need to know before you start building your resume.</p>
    </div>
    <div className="mx-auto mt-10 max-w-3xl space-y-2.5">
      {FAQS.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} />)}
    </div>
  </SectionContainer>
);
