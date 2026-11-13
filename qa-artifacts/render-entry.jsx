import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as templates from '../src/components/resume/templates/index.js';
import { buildTransformed } from '../src/utils/transformResume.js';

export { templates };

/**
 * Server-render one resume template exactly as the live preview and the
 * PDF render handler do (same component, same transformResume input).
 */
export function render(name, resume, sectionsConfig) {
  const Comp = templates[name];
  if (!Comp) throw new Error(`Unknown template: ${name}`);
  const data = buildTransformed(resume, sectionsConfig || resume.sectionsConfig);
  return renderToStaticMarkup(createElement(Comp, { data }));
}

export function renderTransformed(name, data) {
  const Comp = templates[name];
  if (!Comp) throw new Error(`Unknown template: ${name}`);
  return renderToStaticMarkup(createElement(Comp, { data }));
}

export function transform(resume, sectionsConfig) {
  return buildTransformed(resume, sectionsConfig || resume.sectionsConfig);
}
