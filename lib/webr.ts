/**
 * WebR loader and execution helper.
 *
 * Provides a single shared WebR instance (singleton) for the whole app,
 * pre-loads the R packages used across the course, and exposes a
 * `runRCode` helper that captures console output, plots (as PNG data
 * URLs) and simple data frames printed to the console.
 */
import type { WebR as WebRType } from 'webr';

// Packages preloaded so the first executable cell in each lesson runs fast.
// lme4's compiled dependencies (nloptr, minqa, RcppEigen, Matrix, ...) are
// listed explicitly and first: the webR binary repo resolves transitive
// dependencies automatically, but installing them up front makes failures
// in any single package easier to diagnose and avoids partial states.
export const PRELOAD_PACKAGES = [
  'Matrix',
  'RcppEigen',
  'minqa',
  'nloptr',
  'boot',
  'nlme',
  'lattice',
  'MASS',
  'lme4',
  'ggplot2',
  'dplyr',
  // NOTA: 'gap' (dependencia Imports de DHARMa) y 'DHARMa' mismo se omiten
  // deliberadamente aquí. El repositorio binario de webR v0.6.0 no tiene un
  // build wasm de 'gap', por lo que cualquier intento de instalar/cargar
  // 'gap' o 'DHARMa' produce "Error in `loadNamespace(x)`: there is no
  // package called 'gap'" — y este error de carga de namespace NO es
  // capturable de forma fiable con tryCatch/requireNamespace dentro de
  // webR. La solución es no intentar cargarlos nunca: `applyDharmaShim()`
  // sustituye `library(DHARMa)` por un conjunto de funciones de respaldo
  // (ver más abajo) antes de ejecutar cualquier celda.
  'geepack',
  'mgcv',
];

export interface RRunResult {
  /** Combined stdout/stderr text, in order */
  text: string;
  /** Whether the run produced any R-level error */
  error?: string;
  /** PNG data URLs for any plots produced */
  plots: string[];
}

let webRPromise: Promise<WebRType> | null = null;

/** Packages that have been successfully installed at least once. */
const installedPackages = new Set<string>();

/** Remote dataset URLs that have already been copied into webR's VFS. */
const fetchedDatasets = new Set<string>();

/**
 * Returns a shared, lazily-initialised WebR instance. Safe to call
 * multiple times — initialisation only happens once.
 */
export function getWebR(): Promise<WebRType> {
  if (!webRPromise) {
    webRPromise = initWebR();
  }
  return webRPromise;
}

async function initWebR(): Promise<WebRType> {
  const { WebR } = await import('webr');
  const webR = new WebR({
    interactive: false,
    // Carga los binarios de WebR (WASM, workers, paquetes R) directamente
    // desde el CDN oficial en lugar de rutas locales empaquetadas por
    // Next.js/Webpack. Esto evita fallos de carga en producción (Vercel)
    // donde los assets de node_modules/webr no se sirven tal cual.
    //
    // v0.6.0 incluye un repositorio de paquetes binarios mucho más amplio
    // que v0.2.0 (entre ellos nloptr/minqa/RcppEigen, necesarios para
    // cargar lme4), por lo que se fija explícitamente esta versión.
    baseUrl: 'https://webr.r-wasm.org/v0.6.0/',
  });
  await webR.init();

  // Preload commonly used packages so individual cells feel instant.
  // Each package is installed independently so that a single missing or
  // failed package doesn't prevent the rest from loading: a per-cell
  // `library()` call will report a clear "no hay paquete llamado ..."
  // error only for the package(s) that actually failed, and
  // `ensurePackagesAvailable` below will retry on demand.
  for (const pkg of PRELOAD_PACKAGES) {
    try {
      await webR.installPackages([pkg], { quiet: true });
      installedPackages.add(pkg);
    } catch {
      // Non-fatal: retried lazily by ensurePackagesAvailable() when a
      // cell actually calls library()/require() for this package.
    }
  }

  return webR;
}

/**
 * Datasets used across the course. Each entry maps a remote CSV URL (as
 * written in the course's R code blocks) to a copy bundled with the app
 * under `public/data/`.
 *
 * webR's in-worker `read.csv(url)` / network connections do not reliably
 * support HTTPS + CORS fetches to raw.githubusercontent.com, producing
 * "cannot open the connection" errors. To avoid this entirely, R code is
 * rewritten to read a same-origin copy instead: the file is fetched here
 * on the main thread (a normal browser `fetch` to `/data/...`, served by
 * Next.js from `public/data/`) and written into webR's virtual
 * filesystem.
 */
const DATASET_URLS: Record<string, string> = {
  'https://raw.githubusercontent.com/jcsalazaru/datasets/main/SPRUCE1.csv': 'spruce1.csv',
  'https://raw.githubusercontent.com/jcsalazaru/datasets/main/progesterone.csv': 'progesterone.csv',
  'https://raw.githubusercontent.com/jcsalazaru/datasets/main/coldfeet.csv': 'coldfeet.csv',
  'https://raw.githubusercontent.com/jcsalazaru/datasets/main/toenail2.csv': 'toenail2.csv',
};

const DATA_DIR = '/data';

/**
 * Copies (once) any dataset referenced by `code` from `public/data/` into
 * webR's virtual filesystem so the rewritten R code can read it locally.
 */
async function ensureDatasetsAvailable(webR: WebRType, code: string): Promise<void> {
  const needed = Object.entries(DATASET_URLS).filter(
    ([url]) => code.includes(url) && !fetchedDatasets.has(url)
  );
  if (needed.length === 0) return;

  try {
    await webR.FS.mkdir(DATA_DIR);
  } catch {
    // Directory probably already exists.
  }

  for (const [url, filename] of needed) {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(
        `No se pudo cargar el conjunto de datos "${filename}" (HTTP ${response.status}).`
      );
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    await webR.FS.writeFile(`${DATA_DIR}/${filename}`, bytes);
    fetchedDatasets.add(url);
  }
}

/** Replaces references to known remote dataset URLs with local VFS paths. */
function rewriteDatasetUrls(code: string): string {
  let rewritten = code;
  for (const [url, filename] of Object.entries(DATASET_URLS)) {
    rewritten = rewritten.split(url).join(`${DATA_DIR}/${filename}`);
  }
  return rewritten;
}

/**
 * Packages that must never be installed or `library()`-loaded in webR:
 * doing so triggers "Error in `loadNamespace(x)`: there is no package
 * called 'gap'" (see the note on `PRELOAD_PACKAGES` above). `DHARMa` calls
 * are rewritten by {@link applyDharmaShim} before execution, so neither
 * `ensurePackagesAvailable` nor the R code actually needs them.
 */
const UNSUPPORTED_PACKAGES = new Set(['DHARMa', 'gap']);

/**
 * `DHARMa` (CRAN) lists `gap` under `Imports:`, and webR's binary package
 * repo (as of v0.6.0) does not provide a WASM build of `gap` (a
 * Fortran/C-heavy genetics package). This means `library(DHARMa)` fails
 * with "there is no package called 'gap'" even when `DHARMa` itself
 * installs successfully — no install order or retry fixes this.
 *
 * To keep the diagnostic cells usable, this lightweight shim re-implements
 * the small subset of DHARMa's API used across the course
 * (`simulateResiduals`, `plot()`, `testUniformity`, `testDispersion`,
 * `testOutliers`, `plotResiduals`) using only base R + the `simulate()`
 * method already provided by lme4/mgcv. The statistical idea (simulate
 * from the fitted model, compare the observed value's rank within the
 * simulated distribution to get a residual that is Uniform(0,1) under a
 * correct model) is the same one DHARMa itself is built on.
 */
const DHARMA_SHIM = `
simulateResiduals <- function(object, n = 250, ...) {
  obs <- as.numeric(model.response(model.frame(object)))
  sims <- simulate(object, nsim = n, re.form = NA)
  simMat <- matrix(as.numeric(as.matrix(sims)), ncol = n)
  fittedVals <- as.numeric(fitted(object))
  resid <- numeric(length(obs))
  for (i in seq_along(obs)) {
    sv <- simMat[i, ]
    resid[i] <- (sum(sv < obs[i]) + 0.5 * sum(sv == obs[i])) / n
  }
  eps <- 1 / (2 * n)
  resid[resid <= 0] <- eps
  resid[resid >= 1] <- 1 - eps
  structure(list(observedResponse = obs, simulatedResponse = simMat,
                  fittedPredictedResponse = fittedVals,
                  scaledResiduals = resid, nSim = n),
            class = "dharma_lite")
}

print.dharma_lite <- function(x, ...) {
  cat("Objeto de residuos simulados (DHARMa-lite)\\n")
  cat("  Observaciones:", length(x$observedResponse), "\\n")
  cat("  Simulaciones :", x$nSim, "\\n")
  invisible(x)
}

plot.dharma_lite <- function(x, ...) {
  op <- par(mfrow = c(1, 2))
  on.exit(par(op))
  qq_y <- sort(x$scaledResiduals)
  qq_x <- ppoints(length(qq_y))
  plot(qq_x, qq_y, main = "QQ residuos simulados", xlab = "Esperado (Unif(0,1))",
       ylab = "Observado", pch = 16, col = "steelblue")
  abline(0, 1, col = "red", lwd = 2)
  plot(x$fittedPredictedResponse, x$scaledResiduals,
       main = "Residuos vs. ajustados", xlab = "Predicho",
       ylab = "Residuo simulado", pch = 16, col = "steelblue")
  abline(h = 0.5, col = "red", lty = 2, lwd = 2)
}

testUniformity <- function(simulationOutput, ...) {
  res <- ks.test(simulationOutput$scaledResiduals, "punif")
  res$method <- "DHARMa-lite: prueba de uniformidad (Kolmogorov-Smirnov, base R)"
  res
}

testDispersion <- function(simulationOutput, ...) {
  obsVar <- var(simulationOutput$observedResponse)
  simVar <- apply(simulationOutput$simulatedResponse, 2, var)
  stat <- obsVar / mean(simVar)
  p <- mean(simVar >= obsVar)
  p <- 2 * min(p, 1 - p)
  structure(list(statistic = c("ratio.obs.sim" = stat), p.value = p,
                  method = "DHARMa-lite: prueba de dispersion (basada en simulacion)",
                  alternative = "two.sided",
                  data.name = "modelo simulado"),
            class = "htest")
}

testOutliers <- function(simulationOutput, ...) {
  r <- simulationOutput$scaledResiduals
  nObs <- length(r)
  nSim <- simulationOutput$nSim
  eps <- 1 / (2 * nSim)
  outliers <- sum(r <= eps | r >= 1 - eps)
  p <- 1 - pbinom(outliers - 1, nObs, 1 / nSim)
  structure(list(statistic = c(outliers = outliers), p.value = p,
                  method = "DHARMa-lite: prueba de outliers (basada en simulacion)",
                  alternative = "two.sided",
                  data.name = "modelo simulado"),
            class = "htest")
}

plotResiduals <- function(simulationOutput, form = NULL, ...) {
  if (is.null(form)) {
    form <- simulationOutput$fittedPredictedResponse
    xlab <- "Predicho"
  } else {
    xlab <- "Covariable"
  }
  plot(form, simulationOutput$scaledResiduals,
       main = "Residuos simulados vs. covariable", xlab = xlab,
       ylab = "Residuo simulado", pch = 16, col = "steelblue")
  abline(h = 0.5, col = "red", lty = 2, lwd = 2)
}
`.trim();

const DHARMA_LIBRARY_RE = /^[ \t]*(?:library|require)\(\s*["']?DHARMa["']?\s*\)[ \t]*\n?/gm;

/**
 * Unconditionally replaces every `library(DHARMa)`/`require(DHARMa)` call
 * with {@link DHARMA_SHIM}.
 *
 * Earlier versions of this helper tried `requireNamespace("DHARMa", quietly
 * = TRUE)` first and only fell back to the shim if that returned `FALSE`.
 * In practice, attempting to load `DHARMa` (which `Imports: gap`, and `gap`
 * has no wasm build) still surfaces
 * "Error in `loadNamespace(x)`: there is no package called 'gap'" as the
 * *cell's* final error even when the call is wrapped in
 * `tryCatch`/`requireNamespace`, so the conditional never actually reached
 * the shim. The only reliable fix is to never call `library(DHARMa)` /
 * `loadNamespace("DHARMa")` at all.
 */
function applyDharmaShim(code: string): string {
  if (!DHARMA_LIBRARY_RE.test(code)) return code;
  DHARMA_LIBRARY_RE.lastIndex = 0;

  const replacement = [
    '# library(DHARMa) no disponible en WebR (falta el paquete "gap");',
    '# se usa un sustituto ligero basado en base R (ver lib/webr.ts).',
    DHARMA_SHIM,
    '',
    '',
  ].join('\n');

  return code.replace(DHARMA_LIBRARY_RE, replacement);
}

/**
 * Scans R code for `library(pkg)` / `require(pkg)` calls and installs any
 * package that wasn't successfully preloaded at boot time. This makes
 * package availability resilient to transient failures during
 * `initWebR()` (e.g. a single slow/failed download at startup no longer
 * permanently breaks that package for the whole session).
 *
 * Packages in {@link UNSUPPORTED_PACKAGES} (DHARMa, gap) are skipped:
 * `applyDharmaShim` rewrites those calls away before the code ever runs,
 * and attempting to install/load them anyway risks the uncatchable
 * "no package called 'gap'" namespace-loading error.
 */
async function ensurePackagesAvailable(webR: WebRType, code: string): Promise<void> {
  const matches = code.matchAll(/(?:library|require)\(\s*["']?([A-Za-z0-9._]+)["']?\s*\)/g);
  const needed = new Set<string>();
  for (const m of matches) {
    const pkg = m[1];
    if (UNSUPPORTED_PACKAGES.has(pkg)) continue;
    needed.add(pkg);
  }

  for (const pkg of needed) {
    if (installedPackages.has(pkg)) continue;
    try {
      await webR.installPackages([pkg], { quiet: true });
      installedPackages.add(pkg);
    } catch {
      // Leave it: library()/require() inside captureR() will surface a
      // descriptive R-level error for this specific package.
    }
  }
}

/**
 * Runs a chunk of R code, capturing printed output and any plots
 * generated via the `Cairo`/`png` graphics device that WebR exposes
 * through its canvas capture API.
 */
export async function runRCode(code: string): Promise<RRunResult> {
  const webR = await getWebR();
  const plots: string[] = [];
  const outputLines: string[] = [];
  let errorMsg: string | undefined;

  // Open a capturing canvas device so any base/ggplot2 plot is recorded.
  const shelter = await new webR.Shelter();

  try {
    // Make sure any package referenced via library()/require() and any
    // dataset referenced by URL are available before running the code.
    await ensurePackagesAvailable(webR, code);
    await ensureDatasetsAvailable(webR, code);
    const withDatasetUrls = rewriteDatasetUrls(code);
    const codeToRun = applyDharmaShim(withDatasetUrls);

    // Set up a graphics device that writes to an offscreen canvas.
    await webR.evalRVoid(
      `webr::canvas(width = 720, height = 480)`,
      { withAutoprint: false }
    );

    const result = await shelter.captureR(codeToRun, {
      withAutoprint: true,
      captureStreams: true,
      captureConditions: true,
    });

    for (const out of result.output) {
      if (out.type === 'stdout' || out.type === 'stderr') {
        outputLines.push(out.data as string);
      } else if (out.type === 'message' || out.type === 'warning') {
        const data = out.data as { message?: string };
        if (data?.message) outputLines.push(data.message.trimEnd());
      } else if (out.type === 'error') {
        const data = out.data as { message?: string };
        errorMsg = data?.message ?? String(out.data);
        if (errorMsg) outputLines.push(`Error: ${errorMsg}`);
      }
    }

    // Collect any captured plot images.
    for (const img of result.images) {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        plots.push(canvas.toDataURL('image/png'));
      }
    }
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : String(err);
  } finally {
    try {
      await webR.evalRVoid(`try(dev.off(), silent = TRUE)`, { withAutoprint: false });
    } catch {
      /* ignore */
    }
    shelter.purge();
  }

  return { text: outputLines.join('\n'), error: errorMsg, plots };
}
