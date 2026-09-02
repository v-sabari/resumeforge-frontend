import { Link, useParams } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';
import {ARTICLES} from '../data/articles';
/* ── Inline markdown renderer ──────────────────────────────────── */
const renderInlineMarkdown = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="font-semibold text-ink-950">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
};

/* ── Article data ──────────────────────────────────────────────── */


/* ── Resources list page ─────────────────────────────────────────── */
export const ResourcesPage = () => (
  <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
    <div className="mb-10">
      <p className="kicker mb-2">Career Resources</p>
      <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink-950 tracking-tight">
        Resume &amp; career advice for job seekers
      </h1>
      <p className="mt-3 text-ink-400 max-w-xl">
        Practical, actionable guides to help you write better resumes, navigate job searches,
        and advance your career — from our team and community.
      </p>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ARTICLES.map((article) => (
        <Link
          key={article.slug}
          to={`/resources/${article.slug}`}
          className="card-hover p-5 flex flex-col gap-3"
        >
          <span className="badge-brand self-start">{article.category}</span>
          <h2 className="text-base font-semibold text-ink-950 leading-snug">
            {article.title}
          </h2>
          <p className="text-sm text-ink-400 line-clamp-3 leading-relaxed flex-1">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-ink-300 pt-1 border-t border-surface-100">
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>
        </Link>
      ))}
    </div>

    <div className="mt-14 card p-8 text-center border-brand-200 bg-gradient-to-r from-brand-50 to-surface-50">
      <h2 className="text-xl font-display font-semibold text-ink-950 mb-2">
        Ready to build your resume?
      </h2>
      <p className="text-ink-400 text-sm mb-5">
        Apply these tips using our AI-powered resume builder. Free to start.
      </p>
      <Link to="/register" className="btn-primary">
        Build my resume free <Icon name="arrowRight" className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

/* ── Individual article page ─────────────────────────────────────── */
export const ArticlePage = () => {
  const { slug } = useParams();
  const article = ARTICLES.find((item) => item.slug === slug);

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-ink-950 mb-3">Article not found</h1>
        <Link to="/resources" className="btn-secondary">
          Back to resources
        </Link>
      </div>
    );
  }

  const paragraphs = article.content.trim().split('\n');

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-ink-400 mb-8">
        <Link to="/resources" className="hover:text-brand-600 transition-colors">
          Resources
        </Link>
        <Icon name="chevronRight" className="h-4 w-4" />
        <span className="text-ink-600">{article.category}</span>
      </nav>

      <div className="mb-8">
        <span className="badge-brand mb-3 inline-block">{article.category}</span>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink-950 tracking-tight leading-snug mb-4">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-ink-400">
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>
      </div>

      <p className="text-lg text-ink-600 leading-relaxed border-l-4 border-brand-300 pl-4 mb-8 italic">
        {article.excerpt}
      </p>

      <div className="prose-content text-ink-700 leading-relaxed">
  {(() => {
    const elements = [];
    let i = 0;

    while (i < paragraphs.length) {
      const trimmed = paragraphs[i].trim();

      if (!trimmed) {
        i++;
        continue;
      }

      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2
            key={i}
            className="text-xl font-display font-semibold text-ink-950 mt-8 mb-3"
          >
            {renderInlineMarkdown(trimmed.slice(3))}
          </h2>
        );
        i++;
        continue;
      }

      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3
            key={i}
            className="text-base font-semibold text-ink-950 mt-5 mb-2"
          >
            {renderInlineMarkdown(trimmed.slice(4))}
          </h3>
        );
        i++;
        continue;
      }

      if (trimmed.startsWith('- ')) {
        const items = [];

        while (i < paragraphs.length && paragraphs[i].trim().startsWith('- ')) {
          items.push(
            <li key={i}>
              {renderInlineMarkdown(paragraphs[i].trim().slice(2))}
            </li>
          );
          i++;
        }

        elements.push(
          <ul
            key={`ul-${i}`}
            className="list-disc ml-6 space-y-2 text-sm text-ink-600 mb-4"
          >
            {items}
          </ul>
        );

        continue;
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const items = [];

        while (
          i < paragraphs.length &&
          /^\d+\.\s/.test(paragraphs[i].trim())
        ) {
          items.push(
            <li key={i}>
              {renderInlineMarkdown(
                paragraphs[i].trim().replace(/^\d+\.\s/, '')
              )}
            </li>
          );
          i++;
        }

        elements.push(
          <ol
            key={`ol-${i}`}
            className="list-decimal ml-6 space-y-2 text-sm text-ink-600 mb-4"
          >
            {items}
          </ol>
        );

        continue;
      }

      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        elements.push(
          <p key={i} className="font-semibold text-ink-950 text-sm">
            {trimmed.slice(2, -2)}
          </p>
        );
        i++;
        continue;
      }

      elements.push(
        <p key={i} className="text-sm leading-relaxed mb-4">
          {renderInlineMarkdown(trimmed)}
        </p>
      );

      i++;
    }

    return elements;
  })()}
</div>

      <div className="mt-12 card p-6 border-brand-200 bg-brand-50/50">
        <h3 className="font-semibold text-ink-950 mb-2">
          Build an ATS-ready resume in minutes
        </h3>
        <p className="text-sm text-ink-500 mb-4">
          ResumeForge AI writes your bullet points, optimises for ATS, and exports a clean PDF — free to start.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/register" className="btn-primary btn-sm">
            Start for free
          </Link>
          <Link to="/resources" className="btn-secondary btn-sm">
            More resources
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-base font-semibold text-ink-950 mb-4">
          More from our resources
        </h3>
        <div className="space-y-3">
          {ARTICLES.filter((item) => item.slug !== slug)
            .slice(0, 3)
            .map((relatedArticle) => (
              <Link
                key={relatedArticle.slug}
                to={`/resources/${relatedArticle.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-100 transition-colors"
              >
                <Icon name="arrowRight" className="h-4 w-4 text-brand-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-ink-900">
                    {relatedArticle.title}
                  </p>
                  <p className="text-xs text-ink-400">
                    {relatedArticle.category} · {relatedArticle.readTime}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};