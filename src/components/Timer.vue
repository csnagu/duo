<template>
  <v-layout align-center>
    <v-flex xs3>
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
    <v-flex xs9>
      <v-col>
        <span
          class="wipTime"
          v-if="task.tasks.length === 0 && !task.done"
        >{{ task.wipTime | timeFormatter }}</span>
        <v-spacer></v-spacer>
        <span class="workTime">{{ task.workTime | timeFormatter }}</span>
      </v-col>
    </v-flex>
  </v-layout>
</template>


<script>
import { msToHHMMSS } from "@/utils";
export default {
  props: {
    task: Object,
    parentTask: Object
  },
  filters: {
    timeFormatter: function(ms) {
      return msToHHMMSS(ms);
    }
  },
  watch: {
    "task.done": function() {
      // done時にタイマーが動いてる場合は停止する
      if (this.task.isRunning) {
        this.stopTimer(this.task);
      }
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
      task.wipTime = nowTime - task.startTime;

      task.timerAnimation = requestAnimationFrame(() => {
        this.startTimer(task);
      });
    },
    stopTimer: function(task) {
      if (this.parentTask) {
        this.parentTask.workTime += task.wipTime;
      }
      task.workTime += task.wipTime;

      task.isRunning = false;
      cancelAnimationFrame(task.timerAnimation);
    }
  }
};
</script>
