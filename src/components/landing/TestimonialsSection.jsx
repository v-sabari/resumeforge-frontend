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
    quote: 'I unlocked the first export, saw the quality, and upgraded right away. It felt like a real premium product.',
  },
];

export const TestimonialsSection = () => (
  <section className="mx-auto max-w-7xl px-6 py-20">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Loved by candidates</p>
        <h2 className="section-heading mt-4">Designed to feel credible, helpful, and worth paying for.</h2>
      </div>
      <p className="max-w-xl text-sm leading-7 text-slate-600">
        ResumeForge AI is built for candidates who want clean UX, serious export quality, and smarter writing support.
      </p>
    </div>
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <div key={testimonial.name} className="card p-6">
          <p className="text-base leading-7 text-slate-700">“{testimonial.quote}”</p>
          <div className="mt-6">
            <p className="font-semibold text-slate-950">{testimonial.name}</p>
            <p className="text-sm text-slate-500">{testimonial.role}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
