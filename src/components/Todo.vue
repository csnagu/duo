<template>
  <v-form>
    <v-container justify="center">
      <v-row>
        <v-flex xs2>
          <v-btn icon color="deep-orange lighten-1" @click="addTask(tasks)">
            <v-icon id="addTaskBtn" large>mdi-plus</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs2>
          <v-btn icon color="deep-orange lighten-1" @click="exportText()">
            <v-icon id="addTaskBtn" large>mdi-content-save</v-icon>
          </v-btn>
        </v-flex>
      </v-row>
      <v-col class="py-0">
        <draggable :options="{ group: 'tasks' }" v-model="tasks">
          <div v-for="task in tasks" v-bind:key="task.id">
            <v-row align="center">
              <v-flex xs1 v-if="task.tasks.length !== 0">
                <Progress :task="task"></Progress>
              </v-flex>

              <v-flex xs1 v-else @click="doneTask(task)">
                <v-btn
                  v-if="!task.done"
                  icon
                  color="green"
                  :loading="task.loading"
                >
                  <v-icon class="doneTaskBtn">mdi-circle-outline</v-icon>
                </v-btn>
                <v-icon v-if="task.done" color="green" class="doneTaskBtn"
                  >mdi-check</v-icon
                >
              </v-flex>

              <v-flex xs6>
                <v-text-field
                  single-line
                  v-model="task.item"
                  :disabled="task.done"
                  autofocus
                ></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-btn
                  icon
                  color="pink lighten-2"
                  @click="addTask(task)"
                  v-if="!task.done"
                >
                  <v-icon id="addTaskBtn">mdi-plus</v-icon>
                </v-btn>
              </v-flex>

              <v-flex xs3>
                <Timer :parentTask="null" :task="task"></Timer>
              </v-flex>

              <v-flex xs1>
                <v-icon class="removeTaskBtn" @click="removeTask(task)"
                  >mdi-delete</v-icon
                >
              </v-flex>
            </v-row>

            <!-- sub -->
            <draggable :options="{ group: 'task.tasks' }" v-model="task.tasks">
              <div v-for="child in task.tasks" v-bind:key="child.id">
                <v-row align="center" justify="start">
                  <v-flex xs1></v-flex>
                  <v-flex xs1 @click="doneTask(child)">
                    <v-btn
                      v-if="!child.done"
                      icon
                      color="green"
                      :loading="child.loading"
                    >
                      <v-icon class="doneTaskBtn">mdi-circle-outline</v-icon>
                    </v-btn>
                    <v-icon v-if="child.done" color="green" class="doneTaskBtn"
                      >mdi-check</v-icon
                    >
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="child.item"
                      :disabled="child.done"
                      autofocus
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs3>
                    <Timer :parentTask="task" :task="child"></Timer>
                  </v-flex>

                  <v-flex xs1>
                    <v-icon
                      class="removeTaskBtn"
                      @click="task.tasks = removeSubTask(task.tasks, child)"
                      >mdi-delete</v-icon
                    >
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
import { msToHHMMSS } from "@/utils";

import Timer from "@/components/Timer";
import Progress from "@/components/Progress";

export default {
  components: {
    draggable,
    Timer,
    Progress
  },
  data: function() {
    return {
      tasks: []
    };
  },
  methods: {
    doneTask: function(task) {
      task.loading = true;
      setTimeout(() => {
        task.done = true;
        task.loading = false;
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
    exportText: function() {
      let sendObj = "";
      this.tasks.forEach(elem => {
        sendObj += `${elem.item}, ${msToHHMMSS(elem.workTime)}, ${
          elem.done ? "done" : "not done"
        }\n`;
        elem.tasks.forEach(childElem => {
          sendObj += `\t${childElem.item}, ${msToHHMMSS(childElem.workTime)}, ${
            childElem.done ? "done" : "not done"
          }\n`;
        });
      });

      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = ("00" + (today.getMonth() + 1)).slice(-2);
      const dd = ("00" + today.getDate()).slice(-2);

      const blob = new Blob([sendObj], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      link.download = `todo-${yyyy}-${mm}-${dd}.txt`;
      link.click();
    }
  }
};
</script>
