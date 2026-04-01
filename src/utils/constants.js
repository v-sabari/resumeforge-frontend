export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ResumeForge AI';
export const TOKEN_STORAGE_KEY = 'resumeforge_token';

export const defaultResume = {
  fullName: 'Aarav Mehta',
  professionalTitle: 'Senior Product Designer',
  email: 'aarav@example.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  linkedin: 'linkedin.com/in/aaravmehta',
  github: 'github.com/aaravmehta',
  portfolio: 'aaravdesigns.com',
  summary:
    'Product designer with 7+ years of experience building conversion-focused SaaS experiences across B2B and consumer platforms. Skilled in design systems, UX strategy, and cross-functional collaboration with product and engineering teams.',
  skills: ['Product Strategy', 'Design Systems', 'Figma', 'User Research', 'Interaction Design', 'A/B Testing'],
  experience: [
    {
      id: 'exp-1',
      company: 'OrbitStack',
      role: 'Lead Product Designer',
      startDate: '2022-02',
      endDate: 'Present',
      location: 'Remote',
      bullets: [
        'Led redesign of onboarding flow, improving activation by 24% across self-serve users.',
        'Partnered with product and engineering to launch a multi-brand design system adopted by 5 squads.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Analytics Workspace Revamp',
      link: 'https://example.com/case-study',
      description: 'Reframed dashboard IA and introduced modular widgets that reduced reporting time for customers.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'National Institute of Design',
      degree: 'B.Des, Communication Design',
      startDate: '2012',
      endDate: '2016',
      location: 'Ahmedabad',
      field: 'Communication Design',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Google UX Design Certificate',
      issuer: 'Google',
      year: '2021',
    },
  ],
  achievements: [
    'Speaker at SaaS Design Summit 2024 on scalable systems thinking.',
    'Mentored 6 junior designers into mid-level product design roles.',
  ],
};

export const premiumFeatures = [
  'Unlimited exports',
  'No ad gate after upgrade',
  'Premium template quality',
  'Multiple saved resume versions',
  'Advanced formatting support',
  'Faster application workflow',
];

export const builderSections = [
  { id: 'basics', label: 'Basics' },
  { id: 'summary', label: 'Summary' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'achievements', label: 'Achievements' },
];
