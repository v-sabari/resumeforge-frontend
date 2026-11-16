import { useMemo } from 'react';

/**
 * PHASE-2a: MonthYearPicker
 *
 * Replaces free-text START DATE / END DATE inputs with two native <select>
 * dropdowns (month + year) plus a "Currently working here" checkbox that
 * shows the end date as "Present" when checked.
 *
 * Legacy string preservation (per the brief): existing saved string values
 * like "Jan 2024", "January 2024", "2021", "2024-01" are parsed into the
 * picker's {month, year} shape. Unparseable strings (e.g. "Q1 2024", "Spring
 * 2022") are displayed as a read-only "Custom: <value>" badge next to the
 * picker so the user can see AND keep the legacy value — no silent data loss.
 *
 * The picker stores its value back into the resume as a string in the SAME
 * format the templates already render: "Mon YYYY" (e.g. "Jan 2024"). This
 * means no template changes are needed — the templates' date rendering
 * continues to work unchanged.
 */

const MONTHS = [
  { value: '',  label: 'Month' },
  { value: '1',  label: 'Jan' },
  { value: '2',  label: 'Feb' },
  { value: '3',  label: 'Mar' },
  { value: '4',  label: 'Apr' },
  { value: '5',  label: 'May' },
  { value: '6',  label: 'Jun' },
  { value: '7',  label: 'Jul' },
  { value: '8',  label: 'Aug' },
  { value: '9',  label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' },
];

const MONTH_NAMES = {
  1:'Jan', 2:'Feb', 3:'Mar', 4:'Apr', 5:'May', 6:'Jun',
  7:'Jul', 8:'Aug', 9:'Sep', 10:'Oct', 11:'Nov', 12:'Dec',
};

const MONTH_FULL_TO_NUM = {
  january:'1', february:'2', march:'3', april:'4', may:'5', june:'6',
  july:'7', august:'8', september:'9', october:'10', november:'11', december:'12',
  jan:'1', feb:'2', mar:'3', apr:'4', jun:'6', jul:'7', aug:'8', sep:'9', sept:'9', oct:'10', nov:'11', dec:'12',
};

/**
 * Parse a legacy date string into {month, year, unparseable}.
 * Returns {unparseable: '<original>'} when the string can't be parsed —
 * the caller displays it as-is without data loss.
 */
const parseLegacy = (raw) => {
  if (!raw || typeof raw !== 'string') return { month: '', year: '' };
  const s = raw.trim();
  if (!s) return { month: '', year: '' };
  if (s.toLowerCase() === 'present') return { month: '', year: '', isPresent: true };

  // "Jan 2024" / "January 2024" / "Jan, 2024"
  let m = s.match(/^([A-Za-z]{3,9})[,\s]+(\d{4})$/);
  if (m) {
    const mon = MONTH_FULL_TO_NUM[m[1].toLowerCase()];
    if (mon) return { month: mon, year: m[2] };
  }
  // "2024-01" / "2024-1" (ISO-ish)
  m = s.match(/^(\d{4})-(\d{1,2})$/);
  if (m) {
    const mon = String(parseInt(m[2], 10));
    if (mon >= 1 && mon <= 12) return { month: mon, year: m[1] };
  }
  // "2024" (year only — common in the existing education data)
  m = s.match(/^(\d{4})$/);
  if (m) return { month: '', year: m[1] };
  // Unparseable — return as-is for the caller to display
  return { month: '', year: '', unparseable: s };
};

/** Format {month, year} back into the "Mon YYYY" string the templates render. */
const formatValue = (month, year, isPresent) => {
  if (isPresent) return 'Present';
  if (!year) return '';
  if (!month) return year;
  return `${MONTH_NAMES[parseInt(month, 10)] || ''} ${year}`;
};

export const MonthYearPicker = ({
  label,
  value,
  onChange,
  showPresentCheckbox = false,
  isPresent = false,
  onPresentChange,
  idPrefix,
}) => {
  const parsed = useMemo(() => parseLegacy(value), [value]);
  const monthId = `${idPrefix}-month`;
  const yearId = `${idPrefix}-year`;
  const presentId = `${idPrefix}-present`;

  // Year options: current year back to 1960 (covers all working-age adults),
  // plus current year + 5 forward for end-dates in the near future.
  // P2-3: previously currentYear-50 (reached 1976 for 2026), which excluded
  // anyone who started their career before 1976. 1960 is a safe floor.
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const arr = [{ value: '', label: 'Year' }];
    for (let y = currentYear + 5; y >= 1960; y--) {
      arr.push({ value: String(y), label: String(y) });
    }
    return arr;
  }, [currentYear]);

  const handleMonthChange = (e) => {
    const mon = e.target.value;
    onChange(formatValue(mon, parsed.year, false));
  };
  const handleYearChange = (e) => {
    const yr = e.target.value;
    onChange(formatValue(parsed.month, yr, false));
  };
  const handlePresentToggle = (e) => {
    const checked = e.target.checked;
    onPresentChange?.(checked);
    if (checked) onChange('Present');
    else onChange(formatValue(parsed.month, parsed.year, false));
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="label" htmlFor={monthId}>{label}</label>
      )}
      <div className="flex gap-2">
        <select
          id={monthId}
          className="input flex-1"
          value={parsed.month || ''}
          onChange={handleMonthChange}
          disabled={isPresent}
          aria-label={`${label} month`}
        >
          {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select
          id={yearId}
          className="input flex-1"
          value={parsed.year || ''}
          onChange={handleYearChange}
          disabled={isPresent}
          aria-label={`${label} year`}
        >
          {years.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
        </select>
      </div>
      {showPresentCheckbox && (
        <label className="flex items-center gap-2 text-xs text-ink-500 mt-1">
          <input
            id={presentId}
            type="checkbox"
            checked={isPresent}
            onChange={handlePresentToggle}
            className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
          />
          <span>Currently working here</span>
        </label>
      )}
      {parsed.unparseable && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-1">
          Custom date preserved: <strong>{parsed.unparseable}</strong>
          <span className="block text-ink-400 mt-0.5">
            Pick a month/year above to replace it, or leave as-is to keep the original value.
          </span>
        </p>
      )}
    </div>
  );
};

export default MonthYearPicker;
