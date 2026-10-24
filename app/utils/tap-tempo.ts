export interface TapTempoOptions {
  /** Taps needed before a tempo is reported. */
  minTaps?: number;
  /** How many of the latest intervals are averaged. */
  windowSize?: number;
  /** A pause longer than this starts a new count. */
  resetAfterMs?: number;
}

export interface TapTempoState {
  /** Taps in the current count. */
  taps: number;
  /** Taps still needed before `bpm` is set. */
  remaining: number;
  /** Rounded tempo, or null until `minTaps` taps landed. */
  bpm: number | null;
  /** Milliseconds between the last two taps, or null after the first tap. */
  lastIntervalMs: number | null;
}

export const DEFAULT_TAP_TEMPO: Required<TapTempoOptions> = {
  minTaps: 5,
  windowSize: 4,
  resetAfterMs: 2000,
};

const MS_PER_MINUTE = 60_000;

export function emptyTapTempoState(minTaps: number): TapTempoState {
  return { taps: 0, remaining: minTaps, bpm: null, lastIntervalMs: null };
}

/**
 * Tap tempo: average the latest intervals between taps and turn them into
 * beats per minute. Pure — the caller passes the timestamp of every tap.
 */
export function createTapTempo(options: TapTempoOptions = {}) {
  const { minTaps, windowSize, resetAfterMs } = {
    ...DEFAULT_TAP_TEMPO,
    ...options,
  };
  let times: number[] = [];

  function state(): TapTempoState {
    const taps = times.length;
    const recent = times.slice(-(windowSize + 1));
    const intervals = recent.slice(1).map((t, i) => t - recent[i]!);
    const lastIntervalMs =
      taps > 1 ? times[taps - 1]! - times[taps - 2]! : null;
    if (taps < minTaps || intervals.length === 0) {
      return {
        taps,
        remaining: Math.max(0, minTaps - taps),
        bpm: null,
        lastIntervalMs,
      };
    }
    const mean = intervals.reduce((sum, ms) => sum + ms, 0) / intervals.length;
    return {
      taps,
      remaining: 0,
      bpm: Math.round(MS_PER_MINUTE / mean),
      lastIntervalMs,
    };
  }

  function tap(now: number): TapTempoState {
    const last = times.at(-1);
    if (last !== undefined && (now - last > resetAfterMs || now <= last)) {
      times = [];
    }
    times.push(now);
    return state();
  }

  function reset(): TapTempoState {
    times = [];
    return state();
  }

  return { tap, reset, state };
}
