import { describe, expect, it, vi } from 'vitest';
import { createAnalytics } from '../../app/composables/use-analytics';

describe('createAnalytics', () => {
  it('sends one track() call to GA4, Plausible and OpenPanel', () => {
    const gtag = vi.fn();
    const plausible = vi.fn();
    const openpanel = vi.fn();
    const { track } = createAnalytics({
      ga: { gtag },
      plausible: { plausible },
      openpanel: { track: openpanel },
    });

    const props = { bpm: 120, input: 'keyboard' } as const;
    track('tempo_detected', props);

    expect(gtag).toHaveBeenCalledWith('event', 'tempo_detected', props);
    expect(plausible).toHaveBeenCalledWith('tempo_detected', { props });
    expect(openpanel).toHaveBeenCalledWith('tempo_detected', props);
  });

  it('skips trackers that did not boot (GA4 without an ID)', () => {
    const plausible = vi.fn();
    const openpanel = vi.fn();
    const { track } = createAnalytics({
      plausible: { plausible },
      openpanel: { track: openpanel },
    });

    expect(() =>
      track('install_copy', { command: 'pnpm install' }),
    ).not.toThrow();
    expect(plausible).toHaveBeenCalledOnce();
    expect(openpanel).toHaveBeenCalledOnce();
  });
});
