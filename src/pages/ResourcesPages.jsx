import { Link, useParams } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';

/* ── Article data ──────────────────────────────────────────────── */
export const ARTICLES = [
  {
    slug:     'how-to-write-ats-resume',
    title:    'How to Write an ATS-Friendly Resume in 2025',
    excerpt:  'Most resumes are rejected before a human ever reads them. Learn exactly how Applicant Tracking Systems work and how to structure your resume to pass every ATS filter.',
    category: 'Resume Tips',
    readTime: '8 min read',
    date:     'March 2025',
    content: `
## What is an ATS and Why Does It Matter?

An Applicant Tracking System (ATS) is software used by over 98% of Fortune 500 companies and most mid-size employers to screen resumes before a recruiter ever sees them. If your resume isn't formatted correctly, it gets automatically filtered out — no matter how qualified you are.

The good news: once you understand how ATS systems work, you can write a resume that consistently gets through.

## How ATS Systems Parse Your Resume

When you submit a resume, the ATS extracts text and categorizes it into fields: name, contact info, work history, education, skills. It then scores your resume against the job description using keyword matching.

**What causes ATS failures:**
- Tables, columns, and text boxes (ATS can't read them reliably)
- Images, charts, or graphics
- Headers and footers with key contact information
- Non-standard section titles like "My Journey" instead of "Work Experience"
- PDF files with unusual encoding (some older ATS struggle with them)

## The Right File Format

A clean, single-column Word document (.docx) or a simple, text-based PDF works best. Avoid designer templates with multiple columns, sidebars, or text boxes — they look beautiful to humans but are invisible to machines.

## Section Titles That ATS Recognizes

Use these exact headings:
- **Work Experience** (not "Career History" or "Professional Journey")
- **Education**
- **Skills**
- **Certifications**
- **Summary** or **Professional Summary**
- **Projects**

## Keyword Optimization

Read the job description carefully and mirror its language. If the job says "project management," don't write "programme coordination." ATS systems match exact phrases.

**How to find the right keywords:**
1. Copy the job description into a text editor
2. Identify the most repeated skills, tools, and responsibilities
3. Make sure those exact terms appear in your resume naturally
4. Don't keyword-stuff — write in complete sentences

## Contact Information Placement

Put your name, phone number, email, and LinkedIn URL at the very top of your resume — not in a header or footer. Many ATS systems can't read header/footer content.

## The 6-Second Human Test

Even after passing ATS, your resume has about 6 seconds to impress a recruiter. Use clear formatting, strong action verbs, and quantified achievements (numbers, percentages, dollar amounts) to stand out immediately.

## Summary

The perfect ATS-friendly resume is clean, text-based, keyword-matched to the job description, and uses standard section titles. Tools like ResumeForge AI are built specifically to generate resumes that pass ATS systems and look professional to human reviewers.
    `,
  },
  {
    slug:     'resume-action-verbs-list',
    title:    '200+ Strong Resume Action Verbs (By Category)',
    excerpt:  'Weak verbs like "helped" and "worked on" kill the impact of your experience. Here are 200+ powerful action verbs organized by job function that will make your resume stand out.',
    category: 'Resume Writing',
    readTime: '5 min read',
    date:     'February 2025',
    content: `
## Why Action Verbs Matter

Recruiters spend seconds skimming a resume. Strong action verbs create immediate impact and communicate confidence. "Led a team of 8 engineers" reads very differently from "was part of a team."

The rule: start every bullet point with a strong present-tense or past-tense action verb.

## Leadership & Management
Directed, Spearheaded, Orchestrated, Oversaw, Mentored, Supervised, Championed, Delegated, Mobilized, Coordinated, Established, Launched, Founded, Initiated

## Achievement & Impact
Increased, Reduced, Improved, Delivered, Generated, Achieved, Exceeded, Accelerated, Maximized, Optimized, Boosted, Transformed, Doubled, Tripled

## Technical & Engineering
Architected, Developed, Engineered, Implemented, Deployed, Integrated, Automated, Debugged, Refactored, Scaled, Migrated, Configured, Built, Designed

## Analysis & Research
Analyzed, Evaluated, Assessed, Audited, Investigated, Diagnosed, Forecasted, Identified, Quantified, Researched, Synthesized, Tested, Validated

## Communication & Collaboration
Presented, Negotiated, Facilitated, Collaborated, Liaised, Authored, Communicated, Partnered, Advised, Consulted, Drafted, Trained, Coached

## Sales & Marketing
Acquired, Converted, Grew, Retained, Prospected, Pitched, Closed, Marketed, Promoted, Expanded, Launched, Positioned, Targeted

## Finance & Operations
Managed, Allocated, Budgeted, Forecasted, Processed, Streamlined, Reduced, Audited, Reconciled, Administered, Controlled, Reported

## Education & Healthcare
Educated, Counseled, Assessed, Diagnosed, Treated, Rehabilitated, Instructed, Facilitated, Guided, Supported, Monitored, Evaluated

## Quick-Reference Rules

1. **Past tense for previous roles** — "Led," "Built," "Managed"
2. **Present tense for current role** — "Lead," "Build," "Manage"
3. **Vary your verbs** — Don't start every bullet with "Managed"
4. **Be specific** — "Reduced API response time by 40%" beats "Improved performance"
5. **Avoid passive voice** — "The project was led by me" → "Led the project"
    `,
  },
  {
    slug:     'resume-vs-cv-difference',
    title:    'Resume vs CV: What\'s the Difference and Which Do You Need?',
    excerpt:  'Many job seekers use "resume" and "CV" interchangeably, but they are very different documents used in different contexts. Understanding which one to submit can determine whether you get an interview.',
    category: 'Career Basics',
    readTime: '6 min read',
    date:     'January 2025',
    content: `
## The Core Difference

A **resume** is a concise, 1–2 page summary of your work experience, skills, and education tailored to a specific job. A **curriculum vitae (CV)** is a comprehensive, multi-page document of your entire academic and professional history.

In the United States and Canada, "resume" is the standard for almost all jobs. In the UK, Europe, Australia, and academic settings globally, "CV" is often used — but it typically means what Americans call a resume (1–2 pages).

## When to Use a Resume

- Job applications in the US, Canada
- Industry roles (tech, finance, marketing, operations)
- Any role that specifies "please submit your resume"
- When the employer uses an ATS system (shorter is better)

## When to Use a CV

- Academic positions (professor, researcher, postdoc)
- Medical and scientific roles
- International applications (UK, Europe, Middle East, Asia)
- Grant or fellowship applications
- Any application that specifically requests a CV

## What Goes in Each

**Resume:**
- Professional Summary (3–5 lines)
- Work Experience (last 10 years, most relevant)
- Skills
- Education (degrees only, no high school if you have a degree)
- Certifications (relevant ones)
- 1–2 pages maximum

**CV:**
- Publications
- Conferences and presentations
- Awards and honors
- Grants and funding
- Teaching experience
- Professional memberships
- Research interests
- References
- Length: as long as your career demands (often 3–10+ pages for senior academics)

## The Global Confusion

In many English-speaking countries outside North America, "CV" simply means what Americans call a "resume." When applying to jobs in the UK or Australia and they ask for a "CV," they typically want a 1–2 page resume-style document, not a full academic CV.

## Bottom Line

For most private-sector jobs globally: submit a resume. For academic, medical, or research positions: submit a full CV. When in doubt, read the job description carefully — the format they use in the description usually signals which they want.
    `,
  },
  {
    slug:     'gaps-in-employment-resume',
    title:    'How to Handle Gaps in Employment on Your Resume',
    excerpt:  'Employment gaps are more common than ever. Whether you took time off for health, family, education, or economic reasons, here\'s how to address gaps honestly without hurting your chances.',
    category: 'Resume Tips',
    readTime: '7 min read',
    date:     'December 2024',
    content: `
## Employment Gaps Are Normal

The pandemic, layoffs, family responsibilities, health issues, career transitions — employment gaps happen to millions of people. A well-handled gap rarely disqualifies a candidate. A poorly handled one raises unnecessary red flags.

The key principle: **never lie, never hide, always reframe**.

## Strategies by Gap Length

### Gaps Under 3 Months
Omit months from your date format. Use "2022 – 2024" instead of "March 2022 – January 2024." This is honest and minimizes emphasis on short gaps.

### Gaps of 3–12 Months
Use a brief explanation if you have something relevant to show (freelance work, course, volunteering). If you were simply job-searching, that's fine — you don't need to explain everything on a resume. Save the explanation for the cover letter or interview.

### Gaps Over 1 Year
You'll want to address this more directly. Options:
- **Freelance/consulting work:** List it as a role — "Independent Consultant, [Your Name], 2022–2023"
- **Caregiving:** Many recruiters respect this. "Career break — primary caregiver for a family member" is honest and acceptable.
- **Health reasons:** You're not required to disclose, but "medical leave" or "personal health matter" is professional and sufficient.
- **Education/upskilling:** List the course, certification, or program.
- **Layoff + job search:** Completely normal. No explanation needed on the resume.

## What NOT to Do

- Don't list fake jobs or inflate dates to cover gaps — background checks catch this and it's grounds for immediate rejection and possible legal issues
- Don't write a long, defensive explanation in your resume — keep it brief
- Don't apologize for the gap

## The Cover Letter Is Your Friend

A one-sentence honest mention of a gap in your cover letter — "After a planned career break to care for a family member, I'm ready to return to full-time work with renewed focus" — completely neutralizes the concern for most recruiters.

## At the Interview

Prepare a 30-second, confident explanation. Practice it until it feels natural. End with what you learned or how you stayed productive. Then pivot back to your strengths.

## The Bottom Line

Most gaps, if addressed honestly and briefly, have minimal impact on your candidacy. The job market has shifted dramatically since the pandemic. Recruiters have become far more understanding. Focus your resume energy on making your experience, skills, and achievements as compelling as possible.
    `,
  },
  {
    slug:     'linkedin-profile-tips',
    title:    'LinkedIn Profile Tips to Get Noticed by Recruiters in 2025',
    excerpt:  'Your LinkedIn profile is your always-on resume. With over 1 billion members and millions of active recruiters, an optimized LinkedIn profile can bring opportunities directly to you.',
    category: 'Career Growth',
    readTime: '9 min read',
    date:     'November 2024',
    content: `
## Why LinkedIn Matters More Than Ever

Recruiters source candidates on LinkedIn every day. Many roles are filled before they're ever publicly advertised — through recruiter outreach to candidates with strong profiles. An optimized profile isn't just nice-to-have; it's part of your job search infrastructure.

## Profile Photo

A professional headshot increases profile views by up to 14x. You don't need a photographer — a well-lit selfie against a clean background works. Smile, dress professionally, and ensure your face takes up 60% of the frame.

## Headline (Most Underused Space on LinkedIn)

Your headline is not just your job title. It's indexable by LinkedIn's search algorithm and visible in every search result, comment, and connection request.

**Weak:** "Software Engineer at Acme Corp"
**Strong:** "Software Engineer | React + Node.js | Building scalable web apps | Open to remote opportunities"

Include: your role, your core skills or specialization, and optionally a signal of availability or expertise.

## The About Section

Write in first person. Tell your story in 3–5 paragraphs:
1. Who you are and what you do
2. Your biggest professional achievement or area of expertise
3. What you're passionate about or looking for next
4. A call to action (connect, message, etc.)

End with your key skills as a keyword-rich list — this helps LinkedIn's search algorithm surface your profile.

## Experience Section

Mirror your resume here, but LinkedIn allows more space. For each role, write 3–5 bullet points with quantified achievements. Use the same strong action verbs as your resume.

## Skills and Endorsements

Add your top 10 skills in the Skills section. Prioritize skills relevant to your target role. Endorsements add social proof — endorse colleagues and many will endorse you back.

## Recommendations

Three strong recommendations (from managers, senior colleagues, or clients) add significant credibility. Reach out to former managers or colleagues you worked with closely and ask specifically for a recommendation focused on your impact in a particular area.

## Open to Work

Use LinkedIn's "Open to Work" feature. You can make it visible to recruiters only (not your current employer) or public. This directly increases recruiter outreach.

## Activity Matters

Posting once a week, commenting thoughtfully on posts in your field, and sharing your own insights significantly increases your visibility. The LinkedIn algorithm favors active profiles.

## The Profile-Resume Connection

Your LinkedIn profile and resume should tell the same story — consistent dates, titles, and achievements. Recruiters cross-reference them. Inconsistencies raise flags.
    `,
  },
];

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
      {ARTICLES.map((a) => (
        <Link key={a.slug} to={`/resources/${a.slug}`}
          className="card-hover p-5 flex flex-col gap-3">
          <span className="badge-brand self-start">{a.category}</span>
          <h2 className="text-base font-semibold text-ink-950 leading-snug">{a.title}</h2>
          <p className="text-sm text-ink-400 line-clamp-3 leading-relaxed flex-1">{a.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-ink-300 pt-1 border-t border-surface-100">
            <span>{a.date}</span>
            <span>{a.readTime}</span>
          </div>
        </Link>
      ))}
    </div>

    {/* CTA */}
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
  const article  = ARTICLES.find((a) => a.slug === slug);

  if (!article) return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-ink-950 mb-3">Article not found</h1>
      <Link to="/resources" className="btn-secondary">Back to resources</Link>
    </div>
  );

  const paragraphs = article.content.trim().split('\n');

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-400 mb-8">
        <Link to="/resources" className="hover:text-brand-600 transition-colors">Resources</Link>
        <Icon name="chevronRight" className="h-4 w-4" />
        <span className="text-ink-600">{article.category}</span>
      </nav>

      {/* Header */}
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

      {/* Lead */}
      <p className="text-lg text-ink-600 leading-relaxed border-l-4 border-brand-300 pl-4 mb-8 italic">
        {article.excerpt}
      </p>

      {/* Article body — render markdown-like */}
      <div className="prose-content space-y-4 text-ink-700 leading-relaxed">
        {paragraphs.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith('## ')) return (
            <h2 key={i} className="text-xl font-display font-semibold text-ink-950 mt-8 mb-3">
              {trimmed.slice(3)}
            </h2>
          );
          if (trimmed.startsWith('### ')) return (
            <h3 key={i} className="text-base font-semibold text-ink-950 mt-5 mb-2">
              {trimmed.slice(4)}
            </h3>
          );
          if (trimmed.startsWith('- ')) return (
            <li key={i} className="ml-4 text-sm list-disc text-ink-600">{trimmed.slice(2)}</li>
          );
          if (trimmed.startsWith('**') && trimmed.endsWith('**')) return (
            <p key={i} className="font-semibold text-ink-950 text-sm">{trimmed.slice(2, -2)}</p>
          );
          // Inline bold rendering
          const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i} className="text-sm leading-relaxed">
              {parts.map((part, j) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <strong key={j} className="font-semibold text-ink-950">{part.slice(2, -2)}</strong>
                  : part
              )}
            </p>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 card p-6 border-brand-200 bg-brand-50/50">
        <h3 className="font-semibold text-ink-950 mb-2">Build an ATS-ready resume in minutes</h3>
        <p className="text-sm text-ink-500 mb-4">
          ResumeForge AI writes your bullet points, optimises for ATS, and exports a clean PDF — free to start.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/register" className="btn-primary btn-sm">Start for free</Link>
          <Link to="/resources" className="btn-secondary btn-sm">More resources</Link>
        </div>
      </div>

      {/* Related articles */}
      <div className="mt-10">
        <h3 className="text-base font-semibold text-ink-950 mb-4">More from our resources</h3>
        <div className="space-y-3">
          {ARTICLES.filter((a) => a.slug !== slug).slice(0, 3).map((a) => (
            <Link key={a.slug} to={`/resources/${a.slug}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-100 transition-colors">
              <Icon name="arrowRight" className="h-4 w-4 text-brand-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-ink-900">{a.title}</p>
                <p className="text-xs text-ink-400">{a.category} · {a.readTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
