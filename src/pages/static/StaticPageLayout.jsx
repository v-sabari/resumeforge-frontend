import { SectionBadge } from '../../components/common/SectionBadge';

export const StaticPageLayout = ({ eyebrow, title, description, children }) => (
  <section className="section-shell pt-12 sm:pt-16 lg:pt-20">
    <div className="mx-auto max-w-3xl">
      <SectionBadge>{eyebrow}</SectionBadge>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      {description && <p className="mt-4 text-base leading-7 text-slate-500">{description}</p>}
      <div className="card mt-8 p-7 sm:p-9">
        <div className="prose-content">{children}</div>
      </div>
    </div>
  </section>
);
