<template>
  <v-app>
    
    <v-main>

      <navBar />
      <router-view/>

    </v-main>
  </v-app>
</template>

<script>

import navBar from "./components/navbar"

export default {
  name: "App",

  components: {
    navBar
    
 
  },

  data: () => ({
    //
  })
};
</script>
