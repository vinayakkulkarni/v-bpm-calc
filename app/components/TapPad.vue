<script setup lang="ts">
  const BEATS = 4;
  const INTERACTIVE = 'a, button, input, select, textarea, [contenteditable]';

  const { state, tap, reset, minTaps } = useTapTempo();
  const { track } = useAnalytics();

  const bpm = computed(() => state.value.bpm);
  const metronome = useMetronome(bpm);

  const flash = ref(false);
  let flashTimer: ReturnType<typeof setTimeout> | null = null;
  let lastInput: 'pointer' | 'keyboard' = 'pointer';

  const activeBeat = computed(() =>
    metronome.playing.value
      ? metronome.beat.value % BEATS
      : (state.value.taps - 1 + BEATS) % BEATS,
  );

  const status = computed(() => {
    const { taps, remaining, lastIntervalMs } = state.value;
    if (taps === 0) return 'Tap the pad or press any key to the beat';
    if (remaining > 0)
      return `${remaining} more ${remaining === 1 ? 'tap' : 'taps'}`;
    return `${taps} taps · ${Math.round(lastIntervalMs ?? 0)} ms apart`;
  });

  function hit(input: 'pointer' | 'keyboard') {
    lastInput = input;
    if (metronome.playing.value) metronome.stop();
    tap();
    flash.value = true;
    if (flashTimer) clearTimeout(flashTimer);
    flashTimer = setTimeout(() => (flash.value = false), 90);
  }

  function clear() {
    track('tempo_reset', { bpm: bpm.value });
    reset();
  }

  function toggleMetronome() {
    if (!bpm.value) return;
    track('metronome_toggled', {
      playing: !metronome.playing.value,
      bpm: bpm.value,
    });
    metronome.toggle();
  }

  watch(bpm, (value, previous) => {
    if (value && !previous) {
      track('tempo_detected', { bpm: value, input: lastInput });
    }
  });

  function onKeydown(event: KeyboardEvent) {
    if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === 'Tab') return;
    const target = event.target as HTMLElement | null;
    if (target?.closest(INTERACTIVE) && !target.closest('[data-tap-pad]'))
      return;
    if (event.key === 'Escape') {
      clear();
      return;
    }
    event.preventDefault();
    hit('keyboard');
  }

  onMounted(() => window.addEventListener('keydown', onKeydown));
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
    if (flashTimer) clearTimeout(flashTimer);
  });
</script>

<template>
  <section aria-labelledby="tempo-label" class="flex flex-1 flex-col">
    <button
      type="button"
      data-tap-pad
      class="group relative flex flex-1 touch-manipulation flex-col justify-center border-y border-rule px-5 py-8 text-left transition-colors select-none sm:px-8 lg:px-12"
      :class="flash ? 'bg-paper-2' : 'bg-paper'"
      aria-describedby="tap-status"
      @pointerdown.prevent="hit('pointer')"
    >
      <span
        id="tempo-label"
        class="font-mono text-xs tracking-wider text-ink-3 uppercase"
      >
        Tempo · beats per minute
      </span>

      <span
        class="mt-2 block font-display text-[clamp(7rem,34vw,22rem)] leading-[0.8] font-semibold tracking-[-0.05em] tabular-nums transition-colors duration-75"
        :class="flash ? 'text-accent' : 'text-ink'"
        aria-live="polite"
      >
        <template v-if="bpm">{{ bpm }}</template>
        <span v-else class="text-rule" aria-label="No tempo yet">000</span>
      </span>

      <span class="mt-6 flex items-center gap-2" aria-hidden="true">
        <span
          v-for="i in BEATS"
          :key="i"
          class="h-2 w-8 transition-colors duration-75 sm:w-12"
          :class="
            state.taps > 0 && activeBeat === i - 1
              ? i === 1
                ? 'bg-accent'
                : 'bg-ink'
              : 'bg-rule'
          "
        />
      </span>

      <span
        id="tap-status"
        class="mt-4 font-mono text-sm text-ink-2 tabular-nums"
      >
        {{ status }}
      </span>
    </button>

    <div class="flex flex-wrap items-center gap-3 px-5 py-5 sm:px-8 lg:px-12">
      <button
        type="button"
        class="inline-flex h-11 items-center gap-2 bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-accent-ink disabled:cursor-not-allowed disabled:bg-rule disabled:text-ink-3"
        :disabled="!bpm"
        :aria-pressed="metronome.playing.value"
        @click="toggleMetronome"
      >
        <svg
          class="size-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path v-if="metronome.playing.value" d="M7 5h4v14H7zM13 5h4v14h-4z" />
          <path v-else d="M7 4.5v15l12-7.5z" />
        </svg>
        {{ metronome.playing.value ? 'Stop click' : 'Play click' }}
      </button>
      <button
        type="button"
        class="inline-flex h-11 items-center border border-rule px-5 text-sm font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="state.taps === 0"
        @click="clear"
      >
        Reset
      </button>
      <p class="font-mono text-xs text-ink-3">
        {{ minTaps }} taps to read · Esc resets · 2 s pause starts over
      </p>
    </div>
  </section>
</template>
