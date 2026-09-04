import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatWithAI, generateResumeFromChat } from '../services/aiService';
import { Alert } from '../components/common/Alert';
import { Icon } from '../components/icons/Icon';
import { formatApiError } from '../utils/helpers';

const WELCOME = 'Hi! I\'m your AI resume-building coach. Tell me a little about yourself to get started — for example, "I am a Computer Science student and I know Java, SQL and React." I\'ll ask you a few questions and help you build a professional resume.';

const INITIAL_COLLECTED = '';

/**
 * CHAT-01: Premium Voice/Chat Resume Builder.
 *
 * A conversational AI experience (premium-only) that guides the user through
 * building/improving a resume. The conversation is held in-memory (React state)
 * and the full history is sent to the backend each turn — matching the existing
 * stateless OpenRouter integration. Voice input uses the browser's Web Speech
 * API (SpeechRecognition) with graceful handling of missing support /
 * permission / transcription errors; no API keys are exposed in the frontend.
 */
export const ChatResumeBuilderPage = () => {
  const { premium } = useAuth();
  const isPremium = premium?.isPremium;
  const navigate = useNavigate();

  const [messages,   setMessages]   = useState([]);   // [{ role, content }]
  const [input,      setInput]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error,      setError]      = useState('');
  const [ready,      setReady]      = useState(false);
  const [collected,  setCollected]  = useState(INITIAL_COLLECTED);
  const [generated,  setGenerated]  = useState(null);
  const [voiceState, setVoiceState] = useState('idle'); // idle | listening | unsupported | error

  const listRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to the latest message.
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading || generating) return;
    const userMsg = { role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setError('');
    setLoading(true);
    try {
      const res = await chatWithAI({
        chatHistory: history.map(({ role, content }) => ({ role, content })),
        chatResumeContext: collected,
      });
      const replyText = (res && (res.reply || res.message)) || 'Could you tell me a little more about that?';
      const nextContext = res?.collectedInfo
        ? (typeof res.collectedInfo === 'string' ? res.collectedInfo : JSON.stringify(res.collectedInfo))
        : collected;
      setCollected(nextContext);
      setReady(Boolean(res?.readyToGenerate));
      setMessages((m) => [...m, { role: 'assistant', content: replyText }]);
    } catch (e) {
      setError(formatApiError(e, 'The AI could not respond. Please try again.'));
      setMessages(history);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setCollected(INITIAL_COLLECTED);
    setReady(false);
    setGenerated(null);
    setError('');
  };

  /* ── Voice input (Web Speech API) ─────────────────────────────────── */
  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceState('unsupported');
      setError('Voice input is not supported in this browser. You can still type your messages.');
      return;
    }
    try {
      const recognition = new SR();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setVoiceState('listening');
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (!transcript.trim()) {
          setVoiceState('error');
          setError('No speech was detected. Please try again.');
        } else {
          setVoiceState('idle');
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript).trim());
        }
      };
      recognition.onerror = (event) => {
        setVoiceState('error');
        setError(
          event.error === 'not-allowed' || event.error === 'service-not-allowed'
            ? 'Microphone permission was denied. Please allow microphone access and try again.'
            : event.error === 'no-speech'
              ? 'No speech was detected. Please try again.'
              : 'Voice input failed. Please type your message instead.'
        );
      };
      recognition.onend = () => {
        setVoiceState((s) => (s === 'error' ? s : 'idle'));
      };
      recognition.start();
    } catch {
      setVoiceState('error');
      setError('Could not start voice input. Please try again or type instead.');
    }
  };

  const stopVoice = () => {
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
    setVoiceState('idle');
  };

  /* ── Resume generation ────────────────────────────────────────────── */
  const generateResume = async () => {
    if (generating || loading) return;
    setGenerating(true);
    setError('');
    try {
      const res = await generateResumeFromChat({ chatResumeContext: collected });
      setGenerated(res || {});
    } catch (e) {
      setError(formatApiError(e, 'Could not generate the resume. Please try again.'));
    } finally {
      setGenerating(false);
    }
  };

  const openInBuilder = () => {
    sessionStorage.setItem('chat_resume_draft', JSON.stringify(generated || {}));
    navigate('/app/builder');
  };

  /* ── Premium gate ─────────────────────────────────────────────────── */
  if (!isPremium) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 text-white mx-auto">
          <Icon name="sparkles" className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-display font-bold text-ink-950">AI Resume Builder is a Premium Feature</h1>
        <p className="mt-3 text-sm text-ink-500 leading-relaxed">
          Build your resume through a personalized AI conversation. Get guided questions,
          AI suggestions, and a complete resume-building experience.
        </p>
        <button
          onClick={() => navigate('/pricing')}
          className="mt-6 btn-primary justify-center">
          Upgrade to Premium
          <Icon name="arrowRight" className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-display font-bold text-ink-950">Voice & Chat Resume Builder</h1>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5
                             text-[10px] font-semibold uppercase tracking-wide text-amber-700 border border-amber-200">
              Flagship AI Feature
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-500">
            Chat or talk to AI to build your resume. Everything is based only on what you tell me — I never invent anything.
          </p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearConversation} className="btn-secondary btn-sm shrink-0">
            <Icon name="trash" className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      <Alert variant="error" className="mb-4">{error}</Alert>

      {/* Chat panel */}
      <div className="card flex flex-col overflow-hidden" style={{ minHeight: '60vh' }}>
        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: '55vh' }}>
          {messages.length === 0 && !loading && (
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                <Icon name="sparkles" className="h-4 w-4" />
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-brand-50 border border-brand-100 px-3.5 py-2.5 text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">
                {WELCOME}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role !== 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Icon name="sparkles" className="h-4 w-4" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'rounded-tr-sm bg-ink-950 text-white'
                  : 'rounded-tl-sm bg-surface-100 text-ink-700 border border-surface-200'
              }`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                <Icon name="sparkles" className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface-100 border border-surface-200 px-4 py-3">
                <span className="flex h-2 w-2 animate-bounce rounded-full bg-brand-500" />
                <span className="flex h-2 w-2 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: '0.15s' }} />
                <span className="flex h-2 w-2 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-surface-200 p-3">
          {ready && !generated && (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-brand-50 border border-brand-100 p-3">
              <p className="text-xs text-ink-600 flex-1 min-w-[200px]">
                I have enough information to build your resume.
              </p>
              <button onClick={generateResume} disabled={generating}
                className="btn-primary btn-sm">
                {generating ? 'Building…' : 'Generate Resume'}
              </button>
              <button onClick={() => setReady(false)} className="btn-secondary btn-sm">
                Continue Editing
              </button>
            </div>
          )}

          {generated && (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-success-50 border border-success-100 p-3">
              <p className="text-xs text-ink-600 flex-1 min-w-[200px]">
                Your resume is ready. Open it in the builder to review and edit before exporting.
              </p>
              <button onClick={openInBuilder} className="btn-primary btn-sm">
                <Icon name="text" className="h-3.5 w-3.5" /> Open in Builder
              </button>
              <button onClick={() => setGenerated(null)} className="btn-secondary btn-sm">Close</button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              rows={1}
              placeholder="Type your message…"
              className="input resize-none text-sm flex-1"
            />
            <button
              onClick={voiceState === 'listening' ? stopVoice : startVoice}
              disabled={loading || generating}
              title="Use voice input"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                voiceState === 'listening'
                  ? 'bg-danger-600 text-white'
                  : 'bg-surface-100 text-ink-600 hover:bg-surface-200'
              }`}>
              <span className="text-base leading-none">🎙</span>
            </button>
            <button
              onClick={() => send()}
              disabled={loading || generating || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white disabled:opacity-40 transition-colors hover:bg-brand-700">
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-[10px] text-ink-400">
            The AI only uses information you provide. Premium per-day limits apply.
          </p>
        </div>
      </div>
    </div>
  );
};
