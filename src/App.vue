<template>
  <v-app>
    <!-- <v-app-bar app>
      <v-toolbar-title class="headline">
        <span>toolbar</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>-->

    <v-content>
      <Todo />
    </v-content>
  </v-app>
</template>

<script>
import Todo from "./components/Todo";

export default {
  name: "App",
  components: {
    Todo
  },
  data: () => ({
    //
  })
};
</script>
