import ModernProTemplate from './ModernProTemplate';
import MinimalATSTemplate from './MinimalATSTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import FresherTemplate from './FresherTemplate';
import CreativeATSTemplate from './CreativeATSTemplate';

export {
  ModernProTemplate,
  MinimalATSTemplate,
  ExecutiveTemplate,
  FresherTemplate,
  CreativeATSTemplate,
};

export const TEMPLATES = {
  modern: ModernProTemplate,
  minimal: MinimalATSTemplate,
  executive: ExecutiveTemplate,
  fresher: FresherTemplate,
  creative: CreativeATSTemplate,
};

export const TEMPLATE_OPTIONS = [
  { id: 'modern', name: 'Modern Pro', description: 'Clean and professional for all industries' },
  { id: 'minimal', name: 'Minimal ATS', description: 'Maximum ATS compatibility, minimal styling' },
  { id: 'executive', name: 'Executive', description: 'Bold and authoritative for senior roles' },
  { id: 'fresher', name: 'Fresher', description: 'Optimized for entry-level candidates' },
  { id: 'creative', name: 'Creative ATS', description: 'Stylish yet ATS-safe with accent colors' },
];