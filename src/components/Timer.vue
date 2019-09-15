<template>
  <v-layout align-center>
    <v-flex xs4 v-if="task.progress===1">
      <v-btn
        icon
        color="blue"
        @click="timer(task)"
        :disabled="task.done"
        v-if="!task.done && task.tasks.length === 0"
      >
        <v-icon v-if="!task.isRunning" class="timerBtn">mdi-timer</v-icon>
        <v-icon v-else class="timerBtn">mdi-watch-vibrate</v-icon>
      </v-btn>
    </v-flex>
    <v-flex xs8>
      <span class="workTime">{{ task.workTime | msToHHMMSS }}</span>
    </v-flex>
  </v-layout>
</template>


<script>
export default {
  props: {
    task: Object
  },
  filters: {
    msToHHMMSS: function(ms) {
      const hh = String(Math.floor(ms / 3600000) + 100).substring(1);
      const mm = String(
        Math.floor((ms - hh * 3600000) / 60000) + 100
      ).substring(1);
      const ss = String(
        Math.floor((ms - hh * 3600000 - mm * 60000) / 1000) + 100
      ).substring(1);
      return `${hh}:${mm}:${ss}`;
    }
  },
  methods: {
    timer: function(task) {
      if (task.isRunning) {
        this.stopTimer(task);
      } else {
        task.isRunning = true;
        task.startTime = Date.now();
        this.startTimer(task);
      }
    },
    startTimer: function(task) {
      const nowTime = Date.now();
      task.workTime = nowTime - task.startTime;
      task.workTime += task.wipTime;
      task.timerAnimation = requestAnimationFrame(() => {
        this.startTimer(task);
      });
      if (task.done) {
        this.stopTimer(task);
      }
    },
    stopTimer: function(task) {
      task.wipTime = task.workTime;
      task.isRunning = false;
      cancelAnimationFrame(task.timerAnimation);
    }
  }
};
</script>
