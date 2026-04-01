import { SectionBadge } from '../../components/common/SectionBadge';

export const StaticPageLayout = ({ eyebrow, title, description, children }) => (
  <section className="section-shell pt-12 sm:pt-16 lg:pt-20">
    <div className="mx-auto max-w-4xl">
      <SectionBadge>{eyebrow}</SectionBadge>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
      <div className="card mt-10 p-6 sm:p-8 lg:p-10">
        <div className="prose prose-slate max-w-none prose-headings:tracking-tight prose-p:leading-8 prose-li:leading-8">
          {children}
        </div>
      </div>
    </div>
  </section>
);
