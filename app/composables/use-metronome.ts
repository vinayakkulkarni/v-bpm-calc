const LOOKAHEAD_S = 0.1;
const SCHEDULER_MS = 25;
const CLICK_S = 0.03;
const BEATS_PER_BAR = 4;

/**
 * Plays a click at `bpm` with the Web Audio clock and counts beats so the
 * page can pulse in time. The first beat of each bar clicks higher.
 */
export function useMetronome(bpm: Ref<number | null>) {
  const playing = ref(false);
  const beat = ref(0);

  let ctx: AudioContext | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let nextAt = 0;
  let count = 0;

  function click(at: number, accent: boolean) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = accent ? 1320 : 880;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.4, at + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + CLICK_S);
    osc.connect(gain).connect(ctx.destination);
    osc.start(at);
    osc.stop(at + CLICK_S + 0.01);
    const index = count;
    const delayMs = Math.max(0, (at - ctx.currentTime) * 1000);
    setTimeout(() => {
      if (playing.value) beat.value = index;
    }, delayMs);
  }

  function schedule() {
    if (!ctx || !bpm.value) return;
    const step = 60 / bpm.value;
    while (nextAt < ctx.currentTime + LOOKAHEAD_S) {
      click(nextAt, count % BEATS_PER_BAR === 0);
      count += 1;
      nextAt += step;
    }
  }

  async function start() {
    if (playing.value || !bpm.value) return;
    ctx ??= new AudioContext();
    await ctx.resume();
    count = 0;
    nextAt = ctx.currentTime + 0.05;
    playing.value = true;
    schedule();
    timer = setInterval(schedule, SCHEDULER_MS);
  }

  function stop() {
    playing.value = false;
    if (timer) clearInterval(timer);
    timer = null;
  }

  function toggle() {
    if (playing.value) stop();
    else void start();
  }

  watch(bpm, (value) => {
    if (!value) stop();
  });

  onBeforeUnmount(() => {
    stop();
    void ctx?.close();
  });

  return { playing: readonly(playing), beat: readonly(beat), toggle, stop };
}
