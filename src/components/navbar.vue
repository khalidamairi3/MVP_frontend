<template>
    <div>

        
        <v-toolbar
      dark
      prominent
      height ="50"
      dense
      flat
    >
      <v-app-bar-nav-icon height="50">  </v-app-bar-nav-icon>

      <v-toolbar-title> KhaledClasses </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="logout" v-if="user != undefined" icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>
      <v-btn v-else icon>
        <v-icon >mdi-import</v-icon>
      </v-btn>
      
    </v-toolbar>
         <v-alert v-if="err"
      dense
      type="error"
    >
     Something went wrong 
    </v-alert>


    </div>
</template>

<script>
import cookies from "vue-cookies";
import axios from "axios"; 
    export default {
        name:"nav-bar",
        computed: {
            user() {
                return this.$store.state.user; 
            }
        },
        data() {
            return {
                err: false
            }
        },
        methods: {
            logout() {
                if(cookies.get("token") == undefined){
                    return;
                }
                axios.request({
                    url:"https://khaledclasses.ml/api/login",
                    method : "DELETE",
                    data : {
                        loginToken : cookies.get("token")
                    },
                    headers:{
                        "Content-Type": "application/json",
                    }

                }).then(()=>{
                    cookies.remove("token");
                    this.$store.commit("reset");
                    this.$router.push("/");
                }).catch(()=>{
                    this.err = true;
                })


                
            }
        },
    }


</script>

<style lang="sass" scoped>

</style>