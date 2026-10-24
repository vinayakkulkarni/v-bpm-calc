import { describe, expect, it } from 'vitest';
import { createTapTempo } from '../../app/utils/tap-tempo';

function tapEvery(intervalMs: number, count: number, start = 1_000) {
  const tempo = createTapTempo();
  let state = tempo.state();
  for (let i = 0; i < count; i += 1) state = tempo.tap(start + i * intervalMs);
  return state;
}

describe('createTapTempo', () => {
  it('reports nothing until five taps landed', () => {
    const state = tapEvery(500, 4);
    expect(state.bpm).toBeNull();
    expect(state.taps).toBe(4);
    expect(state.remaining).toBe(1);
    expect(state.lastIntervalMs).toBe(500);
  });

  it('turns a steady 500 ms beat into 120 BPM', () => {
    expect(tapEvery(500, 5).bpm).toBe(120);
  });

  it('rounds to the nearest whole BPM', () => {
    // 60000 / 461 = 130.15
    expect(tapEvery(461, 6).bpm).toBe(130);
  });

  it('averages only the latest four intervals', () => {
    const tempo = createTapTempo();
    const times = [0, 1000, 2000, 2500, 3000, 3500, 4000];
    let bpm: number | null = null;
    for (const t of times) bpm = tempo.tap(t).bpm;
    expect(bpm).toBe(120);
  });

  it('starts a new count after a long pause', () => {
    const tempo = createTapTempo();
    for (const t of [0, 500, 1000, 1500, 2000]) tempo.tap(t);
    const state = tempo.tap(5000);
    expect(state.taps).toBe(1);
    expect(state.bpm).toBeNull();
    expect(state.lastIntervalMs).toBeNull();
  });

  it('honours custom options', () => {
    const tempo = createTapTempo({ minTaps: 2, resetAfterMs: 5000 });
    tempo.tap(0);
    expect(tempo.tap(4000).bpm).toBe(15);
  });

  it('reset() clears the count', () => {
    const tempo = createTapTempo();
    tempo.tap(0);
    tempo.tap(500);
    expect(tempo.reset()).toEqual({
      taps: 0,
      remaining: 5,
      bpm: null,
      lastIntervalMs: null,
    });
  });
});
