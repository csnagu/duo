<template>
  <v-form>
    <v-container>
      <v-flex>
        <v-icon id="addTaskBtn" @click="addTask()"
          >mdi-plus-circle-outline</v-icon
        >
      </v-flex>

      <v-col>
        <draggable>
          <v-flex xs6 v-for="task in tasks" v-bind:key="task.id">
            <span>{{ task }}</span>
            <v-row justify="space-around" align="center">
              <v-flex xs1>
                <v-icon class="doneTaskBtn" @click="doneTask(task)"
                  >mdi-check-circle-outline</v-icon
                >
              </v-flex>
              <v-flex xs1>
                <v-icon class="removeTaskBtn" @click="removeTask(task)"
                  >mdi-delete</v-icon
                >
              </v-flex>
              <v-flex xs10>
                <s v-if="task.done">
                  <v-text-field
                    :label="task.item"
                    v-model="task.item"
                  ></v-text-field>
                </s>
                <span v-else>
                  <v-text-field
                    :label="task.item"
                    v-model="task.item"
                  ></v-text-field>
                </span>
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

export default {
  components: {
    draggable
  },
  data: function() {
    return {
      tasks: []
    };
  },
  methods: {
    addTask: function() {
      const obj = {
        id: this.getUniqueStr(),
        item: "",
        done: false
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
    }
  }
};
</script>
