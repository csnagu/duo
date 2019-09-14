<template>
  <v-form>
    <v-container>
      <v-btn icon color="red">
        <v-icon id="addTaskBtn" @click="addTask(tasks)">mdi-plus-circle-outline</v-icon>
      </v-btn>
      <!-- {{ tasks }} -->
      <v-col>
        <draggable :options="{group: 'tasks'}" v-model="tasks">
          <div v-for="task in tasks" v-bind:key="task.id">
            <v-row align="center">
              <v-flex xs1>
                <v-icon class="removeTaskBtn" @click="removeTask(task)">mdi-delete</v-icon>
              </v-flex>
              <v-flex xs6>
                <v-text-field single-line hide-details v-model="task.item"></v-text-field>
                <!-- {{ task }} -->
              </v-flex>
            </v-row>

            <!-- sub -->
            <v-btn icon color="red">
              <v-icon id="addTaskBtn" @click="addTask(task.tasks)">mdi-plus-circle-outline</v-icon>
            </v-btn>

            <draggable :options="{group: 'task.tasks'}" v-model="task.tasks">
              <div v-for="child in task.tasks" v-bind:key="child.id">
                <v-row align="center">
                  <v-flex xs1></v-flex>
                  <v-flex xs1>
                    <v-btn
                      icon
                      color="green"
                      :loading="child.loading"
                      :disabled="child.loading"
                      @click="loader(child)"
                    >
                      <v-icon
                        class="doneTaskBtn"
                        @click="doneSubTask(task.tasks, child)"
                      >mdi-check-circle-outline</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs1>
                    <v-icon
                      class="removeTaskBtn"
                      @click="task.tasks = removeSubTask(task.tasks, child)"
                    >mdi-delete</v-icon>
                  </v-flex>
                  <v-flex xs5>
                    <v-text-field v-model="child.item"></v-text-field>
                    <!-- {{ child }} -->
                  </v-flex>
                  <v-flex xs1>
                    <v-btn icon color="blue">
                      <v-icon
                        v-if="!child.isRunning"
                        class="timerBtn"
                        @click="timer(child)"
                      >mdi-timer</v-icon>
                      <v-icon v-else class="timerBtn" @click="timer(child)">mdi-watch-vibrate</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs1>
                    <span class="workTime">{{ child.workTime | msToHHMMSS }}</span>
                  </v-flex>
                  <v-flex xs2></v-flex>
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
    loader: function(task) {
      task.loading = true;
      setTimeout(() => (task.loading = false), 500);
    },
    addTask: function(arr) {
      const obj = {
        id: this.getUniqueStr(),
        item: "",
        done: false,
        workTime: 0,
        startTime: 0,
        wipTime: 0,
        isRunning: false,
        timerAnimation: undefined,
        loading: false,
        tasks: []
      };
      arr.push(obj);
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
    removeSubTask: function(subTasks, targetTask) {
      return subTasks.filter(task => task !== targetTask);
    },
    doneSubTask: function(subTasks, targetTask) {
      subTasks = subTasks.map(task => {
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
