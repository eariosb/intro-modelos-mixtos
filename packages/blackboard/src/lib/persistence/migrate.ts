import { UNVERSIONED } from './version';

/** A migration step: takes a V(n-1) record, returns a V(n) record. */
export type MigrationFn = (prev: Record<string, unknown>) => Record<string, unknown>;

export interface MigrationChain {
  /** Highest supported version for this store. */
  target: number;
  /** steps[n] migrates a record from V(n-1) to V(n). */
  steps: Record<number, MigrationFn>;
}

export interface MigrationResult<T> {
  record: T;
  from: number;
  migrated: boolean;
}

export class MigrationError extends Error {
  constructor(
    public readonly reason: 'not-an-object' | 'newer-than-supported' | 'missing-step',
    message: string,
  ) {
    super(message);
    this.name = 'MigrationError';
  }
}

function recordVersion(raw: Record<string, unknown>): number {
  return typeof raw.version === 'number' ? raw.version : UNVERSIONED;
}

/**
 * Migrates a persisted record to `chain.target` version.
 * - `version` absent → treated as UNVERSIONED (1).
 * - `version > target` → throws, unless `acceptNewer` is set (forward-compatible
 *   read): the record is re-stamped at `target` and returned for the caller to
 *   validate. Local-first data outlives app releases, so a record written by a
 *   newer build must not white-screen the UI.
 * - missing step → throws MigrationError('missing-step').
 */
export function migrateRecord<T>(
  raw: unknown,
  chain: MigrationChain,
  options: { acceptNewer?: boolean } = {},
): MigrationResult<T> {
  if (typeof raw !== 'object' || raw === null) {
    throw new MigrationError('not-an-object', 'cannot migrate a non-object record');
  }

  let record = { ...(raw as Record<string, unknown>) };
  let version = recordVersion(record);
  const from = version;

  if (version > chain.target) {
    if (!options.acceptNewer) {
      throw new MigrationError(
        'newer-than-supported',
        `record version ${version} is newer than supported ${chain.target}`,
      );
    }
    // Keep the payload, adopt the current schema version. Callers validate
    // and persist the record, which resolves the drift permanently.
    record.version = chain.target;
    return { record: record as T, from, migrated: true };
  }

  while (version < chain.target) {
    const step = chain.steps[version + 1];
    if (!step) {
      throw new MigrationError(
        'missing-step',
        `missing migration step ${version} -> ${version + 1}`,
      );
    }
    record = step(record);
    version += 1;
    record.version = version;
  }

  return { record: record as T, from, migrated: from !== chain.target };
}
