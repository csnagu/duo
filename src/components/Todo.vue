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
                <v-btn icon color="pink lighten-2" @click="addTask(task)" v-if="!task.done">
                  <v-icon id="addTaskBtn">mdi-plus</v-icon>
                </v-btn>
              </v-flex>

              <v-flex xs3>
                <Timer :task="task"></Timer>
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
                    <Timer :task="child"></Timer>
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

import Timer from "@/components/Timer";

export default {
  components: {
    draggable,
    Timer
  },
  data: function() {
    return {
      tasks: []
    };
  },
  methods: {
    doneRatio: function(task) {
      task.progress =
        task.tasks.filter(task => task.done).length / task.tasks.length;

      // TODO: 子タスクをもたない親タスクのprogressはNaNになる
      if (Number.isNaN(task.progress)) {
        task.progress = 1;
      }
      if (task.progress === 1) {
        task.done = true;
      }

      // 親タスクのworkTimeに子タスクのworkTimeを加算する
      // TODO: コンポーネントを分離する
      let totalTime = task.wipTime;
      task.tasks.map(subTask => {
        if (subTask.done) totalTime += subTask.workTime;
      });
      task.workTime = Math.floor(totalTime);
    },
    doneTask: function(task, parent) {
      task.loading = true;
      setTimeout(() => {
        task.loading = false;
        task.done = true;
        if (parent) this.doneRatio(parent);
        else this.doneRatio(task);
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

      if (task.isRunning) {
        // タイマーが動いている場合は停止する
        task.wipTime = task.workTime;
        task.isRunning = false;
        cancelAnimationFrame(task.timerAnimation);
      }

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
    }
  }
};
</script>
