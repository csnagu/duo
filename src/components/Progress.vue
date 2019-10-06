<template>
  <v-layout align-center>
    <v-btn v-if="!task.done" icon disabled>
      <v-icon class="doneProgress" v-if="task.progress >= 0.875"
        >mdi-circle-slice-7</v-icon
      >
      <v-icon class="doneProgress" v-else-if="task.progress >= 0.75"
        >mdi-circle-slice-6</v-icon
      >
      <v-icon class="doneProgress" v-else-if="task.progress >= 0.625"
        >mdi-circle-slice-5</v-icon
      >
      <v-icon class="doneProgress" v-else-if="task.progress >= 0.5"
        >mdi-circle-slice-4</v-icon
      >
      <v-icon class="doneProgress" v-else-if="task.progress >= 0.375"
        >mdi-circle-slice-3</v-icon
      >
      <v-icon class="doneProgress" v-else-if="task.progress >= 0.25"
        >mdi-circle-slice-2</v-icon
      >
      <v-icon class="doneProgress" v-else-if="task.progress >= 0.125"
        >mdi-circle-slice-1</v-icon
      >
      <v-icon class="doneProgress" v-else>mdi-circle-outline</v-icon>
    </v-btn>
    <v-icon class="doneProgress" v-if="task.progress >= 1.0" color="green"
      >mdi-check</v-icon
    >
  </v-layout>
</template>

<script>
export default {
  props: {
    task: Object
  },
  watch: {
    "task.done": function() {
      this.task.progress = 1;
    },
    "task.progress": function(progress) {
      if (progress === 1) {
        this.task.done = true;
      }
    },
    "task.tasks": {
      handler: function(childTask) {
        console.log(this.task);
        this.task.progress =
          childTask.filter(task => task.done).length / childTask.length;
      },
      deep: true
    }
  }
};
</script>
