import type { RagDoc } from '@cursos/blackboard/rag';

export interface BibEntry {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  /** Short topical summary used as the retrievable text. */
  summary: string;
  isbn?: string;
  doi?: string;
}

/**
 * Canonical references for the mixed-models course. These are the ONLY
 * bibliography sources the assistant may cite as [bib:*] — anything else is
 * sanitized to [referencia no verificada].
 */
export const BIBLIOGRAPHY: BibEntry[] = [
  {
    id: 'pinheiro-bates-2000',
    title: 'Mixed-Effects Models in S and S-PLUS',
    authors: 'Pinheiro, J.C.; Bates, D.M.',
    year: 2000,
    venue: 'Springer',
    isbn: '978-0-387-98957-0',
    summary:
      'Referencia fundamental del paquete nlme y de la teoría de modelos lineales mixtos: formulación LMM, estimación por REML/ML, estructuras de covarianza (CS, AR(1), UN), factorización de Cholesky y diagnósticos.',
  },
  {
    id: 'gelman-hill-2007',
    title: 'Data Analysis Using Regression and Multilevel/Hierarchical Models',
    authors: 'Gelman, A.; Hill, J.',
    year: 2007,
    venue: 'Cambridge University Press',
    isbn: '978-0-521-68689-1',
    summary:
      'Enfoque intuitivo y aplicado a modelos multinivel: varying intercepts/slopes, interpretación de coeficientes parciales (partial pooling), visualización y predicción.',
  },
  {
    id: 'fitzmaurice-2011',
    title: 'Applied Longitudinal Analysis',
    authors: 'Fitzmaurice, G.M.; Laird, N.M.; Ware, J.H.',
    year: 2011,
    venue: 'Wiley',
    isbn: '978-0-470-38027-7',
    summary:
      'Texto de referencia para datos longitudinales: modelos marginales vs. efectos aleatorios, GEE, selección de estructura de covarianza y manejo de datos faltantes.',
  },
  {
    id: 'verbeke-molenberghs-2000',
    title: 'Linear Mixed Models for Longitudinal Data',
    authors: 'Verbeke, G.; Molenberghs, G.',
    year: 2000,
    venue: 'Springer',
    isbn: '978-0-387-95027-3',
    summary:
      'Tratamiento riguroso del LMM aplicado a estudios longitudinales: pruebas de razón de verosimilitud, efectos aleatorios, inferencia sobre componentes de varianza.',
  },
  {
    id: 'diggle-2002',
    title: 'Analysis of Longitudinal Data',
    authors: 'Diggle, P.J.; Heagerty, P.; Liang, K.Y.; Zeger, S.L.',
    year: 2002,
    venue: 'Oxford University Press',
    isbn: '978-0-19-852484-7',
    summary:
      'Fundamento estadístico de datos longitudinales y repetidos: modelos de media condicionada vs. marginal, GEE, función variograma y correlación serial.',
  },
  {
    id: 'bates-lme4-2015',
    title: 'Fitting Linear Mixed-Effects Models Using lme4',
    authors: 'Bates, D.; Mächler, M.; Bolker, B.; Walker, S.',
    year: 2015,
    venue: 'Journal of Statistical Software 67(1)',
    doi: '10.18637/jss.v067.i01',
    summary:
      'Paper oficial de lme4: sintaxis lmer, efectos aleatorios cruzados/anidados, módulo modular (LMM/GLMM/NLMM), descomposición de Cholesky dispersa y buenas prácticas de ajuste.',
  },
  {
    id: 'nlme-package',
    title: 'nlme: Linear and Nonlinear Mixed Effects Models (R package documentation)',
    authors: 'Pinheiro, J.; Bates, D.; R Core Team',
    year: 2023,
    venue: 'CRAN',
    summary:
      'Documentación del paquete nlme: lme(), gls(), estructuras corStruct (corCompSymm, corAR1, corSymm) y varFunc para heterocedasticidad.',
  },
  {
    id: 'demidenko-2013',
    title: 'Mixed Models: Theory and Applications with R',
    authors: 'Demidenko, E.',
    year: 2013,
    venue: 'Wiley',
    isbn: '978-1-118-09157-9',
    summary:
      'Teoría matemática de modelos mixtos: estimabilidad, información de Fisher, modelos no lineales de efectos mixtos (NLMM) y aspectos computacionales.',
  },
];

export function bibliographyToDocs(): RagDoc[] {
  return BIBLIOGRAPHY.map((b) => {
    const ids = [b.doi ? ` DOI: ${b.doi}` : '', b.isbn ? ` ISBN: ${b.isbn}` : ''].join('');
    return {
      id: `bib:${b.id}`,
      source: 'bibliography' as const,
      text: `${b.title}. ${b.authors} (${b.year}), ${b.venue}. ${b.summary}${ids}`,
      meta: {
        authors: b.authors,
        year: b.year,
        venue: b.venue,
        doi: b.doi,
        isbn: b.isbn,
      },
    };
  });
}
