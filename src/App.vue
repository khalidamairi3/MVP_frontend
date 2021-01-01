<template>
  <v-app>
    
    <v-main >

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
<style lang="scss" >


.page-header{
  grid-column:1/-1;
  width: 100%;
  padding: 5px;
  border-bottom: 1px solid black;
}

 


</style>