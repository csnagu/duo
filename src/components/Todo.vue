<template>
  <v-form>
    <v-container>
      <v-flex>
        <v-btn icon color="red">
          <v-icon id="addTaskBtn" @click="addTask()">mdi-plus-circle-outline</v-icon>
        </v-btn>
      </v-flex>

      <v-col>
        <draggable>
          <v-flex xs7 v-for="task in tasks" v-bind:key="task.id">
            <!-- <span>{{ task }}</span> -->
            <v-row justify="space-around" align="center">
              <v-flex xs1>
                <v-btn
                  icon
                  color="green"
                  :loading="task.loading"
                  :disabled="task.loading"
                  @click="loader(task)"
                >
                  <v-icon class="doneTaskBtn" @click="doneTask(task)">mdi-check-circle-outline</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs1>
                <v-icon class="removeTaskBtn" @click="removeTask(task)">mdi-delete</v-icon>
              </v-flex>
              <v-flex xs8>
                <s v-if="task.done">
                  <v-text-field single-line v-model="task.item"></v-text-field>
                </s>
                <span v-else>
                  <v-text-field single-line v-model="task.item"></v-text-field>
                </span>
              </v-flex>
              <v-flex xs1>
                <v-btn icon color="blue">
                  <v-icon v-if="!task.isRunning" class="timerBtn" @click="timer(task)">mdi-timer</v-icon>
                  <v-icon v-else class="timerBtn" @click="timer(task)">mdi-watch-vibrate</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs1>
                <span class="workTime">{{ task.workTime | msToHHMMSS }}</span>
              </v-flex>
            </v-row>
          </v-flex>
        </draggable>
      </v-col>
    </v-container>
  </v-form>
</template>

<script>
import draggable from "vuedraggable";
import { setTimeout } from "timers";

export default {
  components: {
    draggable
  },
  data: function() {
    return {
      tasks: [],
      done: false
    };
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
    loader: function(task) {
      task.loading = true;
      setTimeout(() => (task.loading = false), 500);
    },
    addTask: function() {
      const obj = {
        id: this.getUniqueStr(),
        item: "",
        done: false,
        workTime: 0,
        startTime: 0,
        wipTime: 0,
        isRunning: false,
        timerAnimation: undefined,
        loading: false
      };
      this.tasks.push(obj);
    },
    removeTask: function(targetTask) {
      this.tasks = this.tasks.filter(task => task !== targetTask);
    },
    doneTask: function(targetTask) {
      this.tasks = this.tasks.map(task => {
        if (task === targetTask) {
          task.done = true;
        }
        return task;
      });
    },
    getUniqueStr: function() {
      var strong = 1000;
      return (
        new Date().getTime().toString(16) +
        Math.floor(strong * Math.random()).toString(16)
      );
    },
    timer: function(task) {
      if (task.isRunning) {
        task.wipTime = task.workTime;
        this.stopTimer(task);
      } else {
        task.startTime = Date.now();
        this.startTimer(task);
      }
      task.isRunning = !task.isRunning;
    },
    startTimer: function(task) {
      const nowTime = Date.now();
      task.workTime = nowTime - task.startTime;
      task.workTime += task.wipTime;
      task.timerAnimation = requestAnimationFrame(() => {
        this.startTimer(task);
      });
    },
    stopTimer: function(task) {
      cancelAnimationFrame(task.timerAnimation);
    }
  }
};
</script>
