/**
 * src/fonts/pdfFonts.js
 *
 * Static aggregation of the bundled OFL families for the PDF render handler.
 *
 * The preview lazy-loads a single family at runtime (./index.js); the PDF
 * runs once per export in a serverless function and needs the selected
 * family's bytes synchronously, so it imports them here. Importing this module
 * pulls every family into the PDF bundle (that is intended — it is the
 * embedding cost), but it is NOT reachable from the app bundle: the app never
 * imports renderPdfHandler.jsx, so the preview's first-load payload is
 * unaffected.
 *
 * The bytes are byte-for-byte the same as the preview loads, which is what
 * guarantees preview == PDF on wraps and page count.
 */
import { FACES as TINOS } from './tinos.js';
import { FACES as GELASIO } from './gelasio.js';
import { FACES as EB_GARAMOND } from './ebgaramond.js';
import { FACES as ARIMO } from './arimo.js';
import { FACES as CARLITO } from './carlito.js';
import { FACES as CALADEA } from './caladea.js';
import { FACES as COUSINE } from './cousine.js';

const BY_FAMILY = {
  Tinos: TINOS,
  Gelasio: GELASIO,
  'EB Garamond': EB_GARAMOND,
  Arimo: ARIMO,
  Carlito: CARLITO,
  Caladea: CALADEA,
  Cousine: COUSINE,
};

/**
 * @param {string|null} family CSS family name (e.g. 'Tinos')
 * @returns {Array<{family:string, weight:number, base64:string}>} the faces to
 *   embed for that family, or [] for `template`/unknown families.
 */
export const getBundledPdfFontFaces = (family) => {
  const faces = family && BY_FAMILY[family];
  if (!faces) return [];
  return faces.map((f) => ({ family, weight: f.weight, base64: f.base64 }));
};
