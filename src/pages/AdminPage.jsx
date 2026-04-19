import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats, getAdminUsers, toggleAdminPremium, setAdminUserRole,
  getAdminPayments, getAdminAiStats, getAdminReferralStats,
} from '../services/adminService';
import { Loader } from '../components/common/Loader';
import { Alert } from '../components/common/Alert';
import { Icon } from '../components/icons/Icon';
import { prettyDate, formatApiError } from '../utils/helpers';

/* ── Tabs ── */
const TABS = [
  { id: 'overview',  label: 'Overview'  },
  { id: 'users',     label: 'Users'     },
  { id: 'payments',  label: 'Payments'  },
  { id: 'ai',        label: 'AI Usage'  },
  { id: 'referrals', label: 'Referrals' },
];

/* ── Stat tile ── */
const Tile = ({ label, value, sub, accent }) => (
  <div className={`card p-5 ${accent ? 'border-brand-200 bg-brand-50/40' : ''}`}>
    <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">{label}</p>
    <p className={`text-2xl font-display font-semibold ${accent ? 'text-brand-700' : 'text-ink-950'}`}>{value ?? '—'}</p>
    {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
  </div>
);

/* ── Badge ── */
const Badge = ({ children, color = 'neutral' }) => {
  const cls = {
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    danger:  'bg-danger-50  text-danger-700  border-danger-200',
    neutral: 'bg-surface-100 text-ink-500 border-surface-200',
    brand:   'bg-brand-50 text-brand-700 border-brand-200',
  }[color];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {children}
    </span>
  );
};

/* ── Money formatter ── */
const fmt = (n) => n != null ? `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—';
const num = (n) => n != null ? Number(n).toLocaleString() : '—';

/* ═══════════════════════════════════════════════════════════════════ */
export const AdminPage = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [tab, setTab]       = useState('overview');
  const [stats, setStats]   = useState(null);
  const [statsErr, setStatsErr] = useState('');

  // Guard: only admins can see this page
  useEffect(() => {
    if (user && user.role !== 'ADMIN') navigate('/app/dashboard', { replace: true });
  }, [user, navigate]);

  // Load overview stats on mount
  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(e => setStatsErr(formatApiError(e, 'Could not load stats.')));
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="kicker">Admin panel</p>
            <h1 className="text-2xl font-display font-semibold text-ink-950 mt-0.5">ResumeForge AI Admin</h1>
          </div>
          <button onClick={() => navigate('/app/dashboard')}
            className="btn-secondary btn-sm gap-1.5">
            <Icon name="arrowRight" className="h-3.5 w-3.5 rotate-180" />
            Back to app
          </button>
        </div>

        <Alert variant="error">{statsErr}</Alert>

        {/* Tab bar */}
        <div className="flex gap-1 rounded-xl border border-surface-200 bg-surface-50 p-1 w-fit">
          {TABS.map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all
                ${tab === t.id
                  ? 'bg-white shadow-sm text-ink-950'
                  : 'text-ink-400 hover:text-ink-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview'  && <OverviewTab  stats={stats} />}
        {tab === 'users'     && <UsersTab />}
        {tab === 'payments'  && <PaymentsTab />}
        {tab === 'ai'        && <AiTab />}
        {tab === 'referrals' && <ReferralsTab />}
      </div>
    </div>
  );
};

/* ─── Overview Tab ─────────────────────────────────────────────────── */
const OverviewTab = ({ stats: s }) => {
  if (!s) return <div className="card flex items-center justify-center py-16"><Loader label="Loading stats…" /></div>;
  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-3">Users</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Total users"       value={num(s.totalUsers)}       sub="all time" />
          <Tile label="New (30 days)"     value={num(s.newUsersLast30Days)} accent />
          <Tile label="Premium users"     value={num(s.premiumUsers)}      sub="currently active" />
          <Tile label="Verified users"    value={num(s.verifiedUsers)}     sub="email confirmed" />
        </div>
      </section>
      <section>
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-3">Revenue</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Total revenue"        value={fmt(s.totalRevenue)}        sub="all time" accent />
          <Tile label="Revenue (30 days)"    value={fmt(s.revenueLast30Days)}   />
          <Tile label="Total paid payments"  value={num(s.totalPaidPayments)}   sub="all time" />
          <Tile label="Paid (30 days)"       value={num(s.paidPaymentsLast30Days)} />
        </div>
      </section>
      <section>
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-3">AI usage</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Total AI calls"        value={num(s.totalAiCalls)}          sub="all time" />
          <Tile label="AI calls (30 days)"    value={num(s.aiCallsLast30Days)}     accent />
          <Tile label="Tokens (30 days)"      value={num(s.totalTokensLast30Days)} sub="approx cost indicator" />
          <Tile label="Est. AI cost (30d)"
            value={s.totalTokensLast30Days ? `~$${((s.totalTokensLast30Days / 1_000_000) * 0.15).toFixed(2)}` : '—'}
            sub="at $0.15/1M tokens (GPT-4o-mini)" />
        </div>
      </section>
      <section>
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-3">Referrals</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Qualified referrals"  value={num(s.totalQualifiedReferrals)}    sub="all time" />
          <Tile label="Qualified (30 days)"  value={num(s.qualifiedReferralsLast30Days)} accent />
          <Tile label="Pending referrals"    value={num(s.pendingReferrals)}           sub="awaiting qualification" />
        </div>
      </section>
    </div>
  );
};

/* ─── Users Tab ────────────────────────────────────────────────────── */
const UsersTab = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [page,    setPage]    = useState(0);
  const [search,  setSearch]  = useState('');
  const [query,   setQuery]   = useState('');
  const [acting,  setActing]  = useState(null);  // userId currently being modified

  const load = useCallback(() => {
    setLoading(true);
    getAdminUsers(page, 20, query || undefined)
      .then(setData)
      .catch(e => setError(formatApiError(e)))
      .finally(() => setLoading(false));
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => { e.preventDefault(); setQuery(search); setPage(0); };

  const handleTogglePremium = async (userId, current) => {
    setActing(userId);
    try {
      const updated = await toggleAdminPremium(userId, !current);
      setData(prev => ({
        ...prev,
        content: prev.content.map(u => u.id === userId ? updated : u),
      }));
    } catch (e) { setError(formatApiError(e)); }
    finally { setActing(null); }
  };

  const handleToggleRole = async (userId, current) => {
    const next = current === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Set this user's role to ${next}?`)) return;
    setActing(userId);
    try {
      const updated = await setAdminUserRole(userId, next);
      setData(prev => ({
        ...prev,
        content: prev.content.map(u => u.id === userId ? updated : u),
      }));
    } catch (e) { setError(formatApiError(e)); }
    finally { setActing(null); }
  };

  return (
    <div className="space-y-4">
      <Alert variant="error">{error}</Alert>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input type="text" className="input flex-1 max-w-xs text-sm"
          placeholder="Search by name or email…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit" className="btn-primary btn-sm">Search</button>
        {query && (
          <button type="button" onClick={() => { setSearch(''); setQuery(''); setPage(0); }}
            className="btn-secondary btn-sm">Clear</button>
        )}
      </form>

      {/* Table */}
      {loading ? (
        <div className="card flex items-center justify-center py-16"><Loader label="Loading users…" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  {['Name / Email', 'Plan', 'Role', 'Resumes', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-ink-400 uppercase tracking-wide text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {(data?.content || []).map(u => (
                  <tr key={u.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-800">{u.name}</p>
                      <p className="text-ink-400 font-mono">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={u.premium ? 'brand' : 'neutral'}>
                        {u.premium ? 'Premium' : 'Free'}
                      </Badge>
                      {u.premiumExpiresAt && (
                        <p className="text-[10px] text-ink-400 mt-0.5">until {prettyDate(u.premiumExpiresAt)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={u.role === 'ADMIN' ? 'warning' : 'neutral'}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{u.resumeCount}</td>
                    <td className="px-4 py-3 text-ink-400">{prettyDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          disabled={acting === u.id}
                          onClick={() => handleTogglePremium(u.id, u.premium)}
                          className="btn-secondary btn-sm text-[10px] px-2">
                          {acting === u.id ? '…' : u.premium ? 'Revoke Premium' : 'Grant Premium'}
                        </button>
                        <button
                          disabled={acting === u.id}
                          onClick={() => handleToggleRole(u.id, u.role)}
                          className="btn-secondary btn-sm text-[10px] px-2">
                          {acting === u.id ? '…' : u.role === 'ADMIN' ? '→ User' : '→ Admin'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {data && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-surface-100 text-xs text-ink-400">
              <span>Page {(data.number || 0) + 1} of {data.totalPages || 1} · {data.totalElements || 0} users</span>
              <div className="flex gap-2">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                  className="btn-secondary btn-sm disabled:opacity-40">← Prev</button>
                <button disabled={page >= (data.totalPages - 1)} onClick={() => setPage(p => p + 1)}
                  className="btn-secondary btn-sm disabled:opacity-40">Next →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Payments Tab ─────────────────────────────────────────────────── */
const PaymentsTab = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [page,    setPage]    = useState(0);

  useEffect(() => {
    setLoading(true);
    getAdminPayments(page, 20)
      .then(setData).catch(e => setError(formatApiError(e))).finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-4">
      <Alert variant="error">{error}</Alert>
      {loading ? (
        <div className="card flex items-center justify-center py-16"><Loader label="Loading payments…" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  {['User', 'Amount', 'Status', 'Razorpay ID', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-ink-400 uppercase tracking-wide text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {(data?.content || []).map(p => (
                  <tr key={p.id} className="hover:bg-surface-50">
                    <td className="px-4 py-3 font-mono text-ink-600">{p.userEmail}</td>
                    <td className="px-4 py-3 font-semibold text-ink-800">{fmt(p.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge color={p.status === 'PAID' ? 'success' : p.status === 'FAILED' ? 'danger' : 'neutral'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-ink-400">{p.razorpayPaymentId || p.internalPaymentId}</td>
                    <td className="px-4 py-3 text-ink-400">{prettyDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-surface-100 text-xs text-ink-400">
              <span>Page {(data.number || 0) + 1} of {data.totalPages || 1}</span>
              <div className="flex gap-2">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn-secondary btn-sm disabled:opacity-40">← Prev</button>
                <button disabled={page >= (data.totalPages - 1)} onClick={() => setPage(p => p + 1)} className="btn-secondary btn-sm disabled:opacity-40">Next →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── AI Tab ────────────────────────────────────────────────────────── */
const AiTab = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAiStats().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card flex items-center justify-center py-16"><Loader label="Loading AI stats…" /></div>;
  if (!data)   return null;

  const maxCount = Math.max(...(data.featureBreakdown || []).map(f => f.count), 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="AI calls (30 days)"    value={num(data.totalCallsLast30Days)}  accent />
        <Tile label="Tokens (30 days)"      value={num(data.totalTokensLast30Days)} />
        <Tile label="Est. cost (30 days)"
          value={`~$${((data.totalTokensLast30Days / 1_000_000) * 0.15).toFixed(3)}`}
          sub="GPT-4o-mini at $0.15/1M tokens" />
      </div>

      <div className="card p-6">
        <p className="text-sm font-semibold text-ink-800 mb-4">Feature usage — last 30 days</p>
        <div className="space-y-3">
          {(data.featureBreakdown || []).map(f => (
            <div key={f.feature}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-ink-700">{f.feature.replace(/_/g, ' ')}</span>
                <span className="text-ink-400">{num(f.count)} calls</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-200">
                <div className="h-2 rounded-full bg-brand-500 transition-all"
                  style={{ width: `${(f.count / maxCount) * 100}%` }} />
              </div>
            </div>
          ))}
          {!data.featureBreakdown?.length && (
            <p className="text-sm text-ink-400">No AI calls in the last 30 days.</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Referrals Tab ─────────────────────────────────────────────────── */
const ReferralsTab = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminReferralStats().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card flex items-center justify-center py-16"><Loader label="Loading referral stats…" /></div>;
  if (!data)   return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Total referrals"      value={num(data.totalReferrals)}           />
        <Tile label="Qualified"            value={num(data.qualifiedReferrals)}        accent />
        <Tile label="Pending"              value={num(data.pendingReferrals)}          />
        <Tile label="Conversion rate"      value={`${data.conversionRate?.toFixed(1)}%`} sub="qualified / total" />
      </div>
      <Tile label="Qualified (30 days)"   value={num(data.qualifiedLast30Days)}       />

      <div className="card p-6">
        <p className="text-sm font-semibold text-ink-800 mb-4">Top referrers</p>
        {(data.topReferrers || []).length === 0 ? (
          <p className="text-sm text-ink-400">No qualified referrals yet.</p>
        ) : (
          <div className="divide-y divide-surface-100">
            {data.topReferrers.map((r, i) => (
              <div key={r.userId} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-800">{r.userName}</p>
                    <p className="text-xs text-ink-400 font-mono">{r.userEmail}</p>
                  </div>
                </div>
                <Badge color="success">{r.qualifiedCount} qualified</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
