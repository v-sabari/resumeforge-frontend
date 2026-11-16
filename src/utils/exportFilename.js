/**
 * PHASE-4c: standardized export filename.
 *
 * Format: `<Full_Name>_<Role>_Resume.<ext>`
 *   • Full name and role are taken from the resume's personalInfo.
 *   • Both are sanitized: non-[a-zA-Z0-9-] characters replaced with nothing,
 *     spaces replaced with underscores, collapsed to a single underscore.
 *   • If both name and role are empty, falls back to `Resume.<ext>`.
 *   • If only one is present, uses `<Value>_Resume.<ext>`.
 *
 * This OVERRIDES the backend's Content-Disposition filename (which is derived
 * from the resume title and may contain en-dashes, spaces, etc.) so every
 * download from the frontend has a consistent, filesystem-safe name.
 *
 * The backend's safeFilename() in ExportService is unchanged — it still
 * produces a sanitized title-based name as a fallback for direct API calls
 * (e.g. if someone hits /api/export/download/8 directly without going through
 * the frontend).
 */

const sanitize = (s) => {
  if (!s) return '';
  return s
    .trim()
    // Replace spaces with underscores
    .replace(/\s+/g, '_')
    // Remove anything that isn't a letter, digit, hyphen, or underscore
    .replace(/[^a-zA-Z0-9_-]/g, '')
    // Collapse multiple underscores/hyphens
    .replace(/_+/g, '_')
    .replace(/-+/g, '-')
    // Strip leading/trailing underscores/hyphens
    .replace(/^[-_]+|[-_]+$/g, '');
};

export const buildExportFilename = (resume, ext) => {
  if (!ext) ext = 'pdf';
  const name = sanitize(resume?.fullName || '');
  const role = sanitize(resume?.professionalTitle || '');

  let base;
  if (name && role) {
    base = `${name}_${role}_Resume`;
  } else if (name) {
    base = `${name}_Resume`;
  } else if (role) {
    base = `${role}_Resume`;
  } else {
    base = 'Resume';
  }
  return `${base}.${ext}`;
};
