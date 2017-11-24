<template>
  <div id="app" @click="init" @keypress="init">
    <p class='bpm'>
      <span v-if="timesClicked >= 5"> {{ BPM }} BPM</span>
      <span v-if="timesClicked <= 4 && BPM !== null">Click or Press Any key {{5 - timesClicked}} More Time(s) to Get BPM</span>
    </p>
  </div>
</template>
<script>

export default {
  name: 'app',
  mounted() {
    this.init();
  },
  data() {
    return {
      timesClicked: 0,
      timesArray: [],
      lastClickTime: 0,
      date: new Date(),
      BPM: null,
    };
  },
  methods: {
    init() {
      const t = this;
      let last2 = t.timesArray.slice(-4);
      const milliDistence = (((1000 * 60) / (last2[1] - last2[0])) + ((1000 * 60) / (last2[3] - last2[2]))) / 2;
      t.timesClicked += 1;
      t.lastClickTime = Date.now();
      t.timesArray.push(t.lastClickTime);
      t.BPM = Math.round(milliDistence / 5) * 5;
    },
  },
};
</script>
<style>
* {
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Raleway", sans-serif;
  font-weight: bold;
  font-size: 6em;
  text-align: center;
  background: linear-gradient(45deg, #FF6BB0, #67AAF9);
  color: white;
}
@media (max-width: 1200px) {
  body {
    font-size: 2.5em;
  }
}
@media (max-width: 640px) {
  body {
    font-size: 1.5em;
  }
}
</style>
