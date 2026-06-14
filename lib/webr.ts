/**
 * WebR loader and execution helper.
 *
 * Provides a single shared WebR instance (singleton) for the whole app,
 * pre-loads the R packages used across the course, and exposes a
 * `runRCode` helper that captures console output, plots (as PNG data
 * URLs) and simple data frames printed to the console.
 */
import type { WebR as WebRType } from '@r-wasm/webr';

// Packages preloaded so the first executable cell in each lesson runs fast.
export const PRELOAD_PACKAGES = ['lme4', 'nlme', 'ggplot2', 'dplyr', 'DHARMa', 'geepack', 'mgcv'];

export interface RRunResult {
  /** Combined stdout/stderr text, in order */
  text: string;
  /** Whether the run produced any R-level error */
  error?: string;
  /** PNG data URLs for any plots produced */
  plots: string[];
}

let webRPromise: Promise<WebRType> | null = null;

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
  const { WebR } = await import('@r-wasm/webr');
  const webR = new WebR({
    interactive: false,
  });
  await webR.init();

  // Preload commonly used packages so individual cells feel instant.
  try {
    await webR.installPackages(PRELOAD_PACKAGES, { quiet: true });
  } catch {
    // Non-fatal: packages will be installed lazily via library() calls
    // inside individual cells if preloading fails (e.g. offline CDN).
  }

  return webR;
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
    // Set up a graphics device that writes to an offscreen canvas.
    await webR.evalRVoid(
      `webr::canvas(width = 720, height = 480)`,
      { withAutoprint: false }
    );

    const result = await shelter.captureR(code, {
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
