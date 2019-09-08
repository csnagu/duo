<template>
  <v-form>
    <v-container>
      <v-flex>
        <v-icon id="addTaskBtn" @click="addTask()">mdi-plus-circle-outline</v-icon>
      </v-flex>

      <v-col>
        <draggable>
          <v-flex xs6 v-for="task in tasks" v-bind:key="task.id">
            <span>{{ task }}</span>
            <v-row justify="space-around" align="center">
              <v-flex xs1>
                <v-icon class="doneTaskBtn" @click="doneTask(task.id)">mdi-check-circle-outline</v-icon>
              </v-flex>
              <v-flex xs1>
                <v-icon class="removeTaskBtn" @click="removeTask(task.id)">mdi-delete</v-icon>
              </v-flex>
              <v-flex xs10>
                <v-text-field :label="task.item" v-model="task.item"></v-text-field>
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
    removeTask: function(id) {
      const target = this.tasks.find(ele => {
        return ele.id == id;
      });
      const targetIndex = this.tasks.indexOf(target);
      delete this.tasks.splice(targetIndex, 1);
    },
    doneTask: function(id) {
      let target = this.tasks.find(ele => {
        return ele.id == id;
      });
      target.done = true;
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
