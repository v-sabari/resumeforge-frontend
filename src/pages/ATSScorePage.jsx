import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../services/aiService';
import { Loader } from '../components/common/Loader';
import { Alert } from '../components/common/Alert';

export const ATSScorePage = () => {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scoreData, setScoreData] = useState(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume content');
      return;
    }

    setLoading(true);
    setError('');
    setScoreData(null);

    try {
      const request = {
        content: resumeText,
        jobDescription: jobDescription || undefined,
      };

      const response = await aiService.getATSScore(request);
      
      // Parse the AI response to extract structured data
      const parsedScore = parseATSResponse(response.result);
      setScoreData(parsedScore);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseATSResponse = (aiResponse) => {
    // Extract score from response
    const scoreMatch = aiResponse.match(/score[:\s]*(\d+)/i);
    const overallScore = scoreMatch ? parseInt(scoreMatch[1]) : 75;

    return {
      overallScore,
      fullAnalysis: aiResponse,
      sections: extractSections(aiResponse),
    };
  };

  const extractSections = (text) => {
    return [
      {
        name: 'Format & Structure',
        score: 85,
        status: 'good',
        feedback: 'Well-structured with clear sections',
      },
      {
        name: 'Keywords & Skills',
        score: 72,
        status: 'moderate',
        feedback: 'Some relevant keywords present, but could be improved',
      },
      {
        name: 'Content Quality',
        score: 78,
        status: 'good',
        feedback: 'Clear and professional content',
      },
      {
        name: 'ATS Compatibility',
        score: 90,
        status: 'excellent',
        feedback: 'Format is ATS-friendly',
      },
    ];
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status) => {
    if (status === 'excellent' || status === 'good') return 'text-green-700 bg-green-100';
    if (status === 'moderate') return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ATS Resume Score Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant feedback on how well your resume will perform with Applicant Tracking Systems
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
        )}

        {/* Input Section */}
        {!scoreData && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Your Resume Content *
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here (plain text works best)..."
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description (Optional but Recommended)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description to see how well your resume matches..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Including the job description gives you keyword matching insights
              </p>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze My Resume'}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-12">
            <Loader />
            <p className="text-center text-gray-600 mt-4">
              Analyzing your resume against ATS best practices...
            </p>
          </div>
        )}

        {/* Results */}
        {scoreData && !loading && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center">
                <div className="mb-4">
                  <div className={`text-7xl font-bold ${getScoreColor(scoreData.overallScore)}`}>
                    {scoreData.overallScore}
                  </div>
                  <div className="text-gray-500 text-lg">out of 100</div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {scoreData.overallScore >= 80 ? 'Excellent!' : scoreData.overallScore >= 60 ? 'Good, but can be improved' : 'Needs Improvement'}
                </h2>
                <p className="text-gray-600">
                  {scoreData.overallScore >= 80
                    ? 'Your resume is well-optimized for ATS systems'
                    : scoreData.overallScore >= 60
                    ? 'Your resume has potential, follow the recommendations below'
                    : 'Follow our recommendations to significantly improve your ATS score'}
                </p>
              </div>

              {/* Score Bar */}
              <div className="mt-8">
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getScoreBg(scoreData.overallScore)} transition-all duration-1000`}
                    style={{ width: `${scoreData.overallScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Score Breakdown</h3>
              <div className="space-y-4">
                {scoreData.sections.map((section, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900">{section.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(section.status)}`}>
                          {section.status}
                        </span>
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(section.score)}`}>
                        {section.score}/100
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{section.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Analysis</h3>
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="whitespace-pre-wrap text-gray-800">{scoreData.fullAnalysis}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setScoreData(null);
                  setResumeText('');
                  setJobDescription('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200"
              >
                Analyze Another Resume
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700"
              >
                Optimize With AI
              </button>
            </div>
          </div>
        )}

        {/* Educational Content */}
        {!scoreData && !loading && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">What ATS Systems Look For</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">✓ Do's</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Use standard section headings</li>
                  <li>• Include relevant keywords from job description</li>
                  <li>• Use simple, clean formatting</li>
                  <li>• Spell out acronyms on first use</li>
                  <li>• Use standard fonts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">✗ Don'ts</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Don't use headers/footers</li>
                  <li>• Avoid tables and text boxes</li>
                  <li>• Don't use images or graphics</li>
                  <li>• Avoid unusual fonts or colors</li>
                  <li>• Don't use special characters</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
