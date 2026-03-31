import { useState } from 'react';
import { improveSummary, generateBullets, rewriteProfessionally, suggestSkills } from '../../services/aiService';
import { formatApiError, toArray } from '../../utils/helpers';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';

export const AIActionPanel = ({ resume, setResume }) => {
  const [loading, setLoading] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('info');

  const handleSummary = async () => {
    setLoading('summary');
    setMessage('');
    try {
      const response = await improveSummary({ summary: resume.summary, professionalTitle: resume.professionalTitle, skills: resume.skills });
      const nextSummary = response?.summary || response?.data?.summary || response?.result || response?.content;
      if (nextSummary) {
        setResume((prev) => ({ ...prev, summary: nextSummary }));
        setVariant('success');
        setMessage('Summary improved successfully.');
      }
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not improve summary.'));
    } finally {
      setLoading('');
    }
  };

  const handleBullets = async () => {
    setLoading('bullets');
    setMessage('');
    try {
      const latestExperience = resume.experience?.[0];
      const response = await generateBullets({
        role: latestExperience?.role,
        company: latestExperience?.company,
        summary: resume.summary,
        professionalTitle: resume.professionalTitle,
      });
      const bullets = response?.bullets || response?.data?.bullets || toArray(response?.result);
      if (bullets.length) {
        setResume((prev) => ({
          ...prev,
          experience: prev.experience.map((item, index) => index === 0 ? { ...item, bullets } : item),
        }));
        setVariant('success');
        setMessage('Generated experience bullets for your latest role.');
      }
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not generate bullets.'));
    } finally {
      setLoading('');
    }
  };

  const handleSkills = async () => {
    setLoading('skills');
    setMessage('');
    try {
      const response = await suggestSkills({ summary: resume.summary, experience: resume.experience, projects: resume.projects });
      const skills = response?.skills || response?.data?.skills || toArray(response?.result);
      if (skills.length) {
        setResume((prev) => ({ ...prev, skills }));
        setVariant('success');
        setMessage('Skills updated from AI suggestions.');
      }
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not suggest skills.'));
    } finally {
      setLoading('');
    }
  };

  const handleRewrite = async () => {
    setLoading('rewrite');
    setMessage('');
    try {
      const response = await rewriteProfessionally({ text: resume.summary, professionalTitle: resume.professionalTitle });
      const rewritten = response?.text || response?.data?.text || response?.result || response?.summary;
      if (rewritten) {
        setResume((prev) => ({ ...prev, summary: rewritten }));
        setVariant('success');
        setMessage('Summary rewritten professionally.');
      }
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not rewrite content.'));
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="card p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">AI copilot</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-950">Sharpen your resume instantly</h3>
        <p className="mt-2 text-sm text-slate-600">Use backend-powered AI actions to improve quality while preserving a trustworthy editing workflow.</p>
      </div>
      <div className="grid gap-3">
        <button type="button" className="btn-secondary justify-start" onClick={handleSummary} disabled={Boolean(loading)}>
          {loading === 'summary' ? 'Improving summary...' : 'Improve Summary'}
        </button>
        <button type="button" className="btn-secondary justify-start" onClick={handleBullets} disabled={Boolean(loading)}>
          {loading === 'bullets' ? 'Generating bullets...' : 'Generate Experience Bullets'}
        </button>
        <button type="button" className="btn-secondary justify-start" onClick={handleSkills} disabled={Boolean(loading)}>
          {loading === 'skills' ? 'Suggesting skills...' : 'Suggest Skills'}
        </button>
        <button type="button" className="btn-secondary justify-start" onClick={handleRewrite} disabled={Boolean(loading)}>
          {loading === 'rewrite' ? 'Rewriting...' : 'Rewrite Professionally'}
        </button>
      </div>
      <div className="mt-4 min-h-10">
        {loading ? <Loader label="Talking to the AI service..." /> : <Alert variant={variant}>{message}</Alert>}
      </div>
    </div>
  );
};
