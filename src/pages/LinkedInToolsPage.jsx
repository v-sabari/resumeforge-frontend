import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../services/aiService';
import { Loader } from '../components/common/Loader';
import { Alert } from '../components/common/Alert';

export const LinkedInToolsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('headline');
  const [input, setInput] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tools = {
    headline: {
      title: 'LinkedIn Headline Generator',
      description: 'Create a compelling LinkedIn headline that showcases your value proposition',
      placeholder: 'Enter your current role, skills, and what you do (e.g., "Software Engineer skilled in React, Node.js, building scalable web applications")',
      action: 'Generate Headline',
    },
    about: {
      title: 'About Section Writer',
      description: 'Generate a professional About section that tells your career story',
      placeholder: 'Provide your background, key achievements, skills, and what you\'re passionate about',
      action: 'Generate About Section',
    },
    experience: {
      title: 'Experience Optimizer',
      description: 'Rewrite your job experience for maximum LinkedIn impact',
      placeholder: 'Paste your current job description or responsibilities',
      action: 'Optimize Experience',
    },
    skills: {
      title: 'Skills Recommender',
      description: 'Get personalized LinkedIn skills recommendations based on your profile',
      placeholder: 'Describe your role and current skills',
      action: 'Get Skills Recommendations',
    },
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('Please enter some content');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const request = {
        content: input,
        context: jobDescription || undefined,
      };

      const response = await aiService.optimizeLinkedIn(request);
      setResult(response.result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    // Could add a toast notification here
  };

  const currentTool = tools[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            LinkedIn Profile Optimizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered tools to make your LinkedIn profile stand out to recruiters and hiring managers
          </p>
        </div>

        {/* Tool Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex -mb-px">
              {Object.entries(tools).map(([key, tool]) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key);
                    setInput('');
                    setResult('');
                    setError('');
                  }}
                  className={`
                    px-6 py-4 text-sm font-medium whitespace-nowrap
                    ${activeTab === key
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tool.title.replace('LinkedIn ', '')}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Tool Description */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentTool.title}
              </h2>
              <p className="text-gray-600">{currentTool.description}</p>
            </div>

            {error && (
              <Alert type="error" message={error} onClose={() => setError('')} />
            )}

            {/* Input Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Content
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentTool.placeholder}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Optional Job Description */}
            {(activeTab === 'headline' || activeTab === 'about') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Job Description (Optional)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description to tailor your content..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : currentTool.action}
            </button>
          </div>
        </div>

        {/* Result */}
        {(loading || result) && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
              {result && (
                <button
                  onClick={handleCopy}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Copy to Clipboard
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-12">
                <Loader />
              </div>
            ) : (
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="whitespace-pre-wrap text-gray-800">{result}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Want to optimize your entire profile?
          </h3>
          <p className="text-white/90 mb-6">
            Sign up for ResumeForge AI and get unlimited access to all LinkedIn optimization tools
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};
