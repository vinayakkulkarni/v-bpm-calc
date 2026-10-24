import {
  createTapTempo,
  DEFAULT_TAP_TEMPO,
  emptyTapTempoState,
  type TapTempoOptions,
  type TapTempoState,
} from '~/utils/tap-tempo';

/** Reactive wrapper around `createTapTempo`. */
export function useTapTempo(options: TapTempoOptions = {}) {
  const minTaps = options.minTaps ?? DEFAULT_TAP_TEMPO.minTaps;
  const tempo = createTapTempo(options);
  const state = shallowRef<TapTempoState>(emptyTapTempoState(minTaps));

  function tap() {
    state.value = tempo.tap(performance.now());
  }

  function reset() {
    state.value = tempo.reset();
  }

  return { state: readonly(state), tap, reset, minTaps };
}
