const faqs = [
  {
    question: 'How does the free export work?',
    answer: 'Your first export is gated behind a rewarded ad flow. Once completed successfully, the export is unlocked with no watermark for that attempt.',
  },
  {
    question: 'What changes after I upgrade?',
    answer: 'Premium unlocks unlimited exports, removes ads and watermark concerns, and exposes a more convenient editing and template experience.',
  },
  {
    question: 'Does the frontend depend on backend truth for premium?',
    answer: 'Yes. The UI reads auth, premium status, export permission, and ad unlock state from backend endpoints rather than relying on frontend-only flags.',
  },
  {
    question: 'Can I save multiple resumes?',
    answer: 'Yes. The dashboard and builder support multiple saved resumes through the resumes API and show upgrade-oriented value throughout the experience.',
  },
];

export const FaqSection = () => (
  <section id="faq" className="mx-auto max-w-5xl px-6 py-20">
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">FAQ</p>
      <h2 className="section-heading mt-4">Common questions before you build.</h2>
    </div>
    <div className="mt-12 space-y-4">
      {faqs.map((item) => (
        <div key={item.question} className="card p-6">
          <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
        </div>
      ))}
    </div>
  </section>
);
