<template>
  <v-form>
    <v-container justify="center">
      <v-btn icon color="deep-orange lighten-1" @click="addTask(tasks)">
        <v-icon id="addTaskBtn" large>mdi-plus</v-icon>
      </v-btn>
      <v-col class="py-0">
        <draggable :options="{ group: 'tasks' }" v-model="tasks">
          <div v-for="task in tasks" v-bind:key="task.id">
            <v-row align="center">
              <v-flex xs1 v-if="task.tasks.length !== 0">
                <v-btn icon v-if="!task.done" :disabled="task.tasks.length !== 0">
                  <v-icon class="doneProgress" v-if="task.progress >= 0.875">mdi-circle-slice-7</v-icon>
                  <v-icon class="doneProgress" v-else-if="task.progress >= 0.75">mdi-circle-slice-6</v-icon>
                  <v-icon class="doneProgress" v-else-if="task.progress >= 0.625">mdi-circle-slice-5</v-icon>
                  <v-icon class="doneProgress" v-else-if="task.progress >= 0.5">mdi-circle-slice-4</v-icon>
                  <v-icon class="doneProgress" v-else-if="task.progress >= 0.375">mdi-circle-slice-3</v-icon>
                  <v-icon class="doneProgress" v-else-if="task.progress >= 0.25">mdi-circle-slice-2</v-icon>
                  <v-icon class="doneProgress" v-else-if="task.progress >= 0.125">mdi-circle-slice-1</v-icon>
                  <v-icon class="doneProgress" v-else>mdi-circle-outline</v-icon>
                </v-btn>
                <v-icon class="doneProgress" v-if="task.done" color="green">mdi-check-circle-outline</v-icon>
              </v-flex>
              <v-flex xs1 v-else @click="doneTask(task)">
                <v-btn v-if="!task.done" icon color="green" :loading="task.loading">
                  <v-icon class="doneTaskBtn">mdi-circle-outline</v-icon>
                </v-btn>
                <v-icon v-if="task.done" color="green" class="doneTaskBtn">mdi-check-circle-outline</v-icon>
              </v-flex>

              <v-flex xs6>
                <v-text-field single-line v-model="task.item" :disabled="task.done"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-btn icon color="pink lighten-2" :disabled="task.done" @click="addTask(task)">
                  <v-icon id="addTaskBtn">mdi-plus</v-icon>
                </v-btn>
              </v-flex>
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
                <span
                  class="workTime"
                  v-if="task.tasks.length === 0 || task.done"
                >{{ task.workTime | msToHHMMSS }}</span>
              </v-flex>
              <v-flex xs1>
                <v-icon
                  class="removeTaskBtn"
                  @click="removeTask(task)"
                  :disabled="task.done"
                >mdi-delete</v-icon>
              </v-flex>
            </v-row>

            <!-- sub -->
            <draggable :options="{ group: 'task.tasks' }" v-model="task.tasks">
              <div v-for="child in task.tasks" v-bind:key="child.id">
                <v-spacer></v-spacer>
                <v-row align="center" justify="start">
                  <v-flex xs1></v-flex>
                  <v-flex xs1 @click="doneTask(child, task)">
                    <v-btn v-if="!child.done" icon color="green" :loading="child.loading">
                      <v-icon class="doneTaskBtn">mdi-circle-outline</v-icon>
                    </v-btn>
                    <v-icon v-if="child.done" color="green" class="doneTaskBtn">mdi-check</v-icon>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field v-model="child.item" :disabled="child.done"></v-text-field>
                  </v-flex>
                  <v-flex xs3>
                    <v-btn icon color="blue" @click="timer(child)" v-if="!child.done">
                      <v-icon v-if="!child.isRunning" class="timerBtn">mdi-timer</v-icon>
                      <v-icon v-else class="timerBtn">mdi-watch-vibrate</v-icon>
                    </v-btn>
                    <span class="workTime">
                      {{
                      child.workTime | msToHHMMSS
                      }}
                    </span>
                  </v-flex>
                  <v-flex xs1>
                    <v-icon
                      class="removeTaskBtn"
                      @click="task.tasks = removeSubTask(task.tasks, child)"
                      :disabled="child.done"
                    >mdi-delete</v-icon>
                  </v-flex>
                </v-row>
              </div>
            </draggable>
            <!-- end sub -->
          </div>
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
    doneRatio: function(task) {
      task.progress =
        task.tasks.filter(task => task.done).length / task.tasks.length;
      if (task.progress === 1) {
        task.done = true;
        task.tasks.map(subTask => {
          task.workTime += subTask.workTime;
        });
      }
    },
    doneTask: function(task, parent) {
      task.loading = true;
      setTimeout(() => {
        task.loading = false;
        this.stopTimer(task);
        task.done = true;
        this.doneRatio(parent);
      }, 500);
    },
    addTask: function(task) {
      let obj = {
        id: this.getUniqueStr(),
        item: "",
        done: false,
        workTime: 0,
        startTime: 0,
        wipTime: 0,
        isRunning: false,
        timerAnimation: undefined,
        loading: false,
        tasks: [],
        progress: 0
      };

      if (Array.isArray(task)) {
        task.push(obj);
      } else {
        task.tasks.push(obj);
        this.doneRatio(task);
      }
    },
    removeTask: function(targetTask) {
      this.tasks = this.tasks.filter(task => task !== targetTask);
    },
    removeSubTask: function(subTasks, targetTask) {
      return subTasks.filter(task => task !== targetTask);
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
    },
    stopTimer: function(task) {
      task.isRunning = false;
      cancelAnimationFrame(task.timerAnimation);
    }
  }
};
</script>
