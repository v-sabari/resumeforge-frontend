import { SectionContainer } from '../ui/SectionContainer';

const testimonials = [
  {
    quote: "ResumeForge AI helped me land three interviews in one week. The AI bullet generator completely transformed how I described my experience.",
    name: "Priya Sharma",
    role: "Marketing Manager, Bangalore",
    avatar: "PS",
  },
  {
    quote: "The real-time ATS preview is a game changer. I could see exactly how recruiters would scan my resume and adjust on the fly.",
    name: "Rahul Verma",
    role: "Software Engineer, Hyderabad",
    avatar: "RV",
  },
  {
    quote: "Best ₹99 I ever spent. Unlimited exports made the whole process so much smoother for my ongoing job search.",
    name: "Ananya Iyer",
    role: "Product Designer, Mumbai",
    avatar: "AI",
  },
];

export const TestimonialsSection = () => (
  <SectionContainer className="pt-0 sm:pt-0">
    <div className="text-center">
      <p className="eyebrow">Testimonials</p>
      <h2 className="section-heading mt-3">Loved by job seekers across India</h2>
    </div>

    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t, i) => (
        <div key={t.name}
          className={`card card-hover flex flex-col p-6 animate-fade-in-up stagger-${i + 1}`}>
          {/* Stars */}
          <div className="flex gap-0.5 text-amber-400 text-sm">
            {'★★★★★'.split('').map((s, j) => <span key={j}>{s}</span>)}
          </div>
          <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">"{t.quote}"</p>
          <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {t.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{t.name}</p>
              <p className="text-xs text-slate-500">{t.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </SectionContainer>
);
