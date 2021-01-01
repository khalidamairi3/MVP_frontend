<template>
  <div>
    <v-toolbar dark prominent height="50" dense flat>
      <v-app-bar-nav-icon @click="drawer = true" height="50"> </v-app-bar-nav-icon>

      <v-toolbar-title> KhaledClasses </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="logout" v-if="user != undefined" icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>
      <v-btn v-else icon>
        <v-icon>mdi-import</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer v-if="user.id!= undefined && drawer==true"
        v-model="drawer"
        absolute
        temporary
      >
        <v-list
          nav
          dense
        >
          <v-list-item-group
            v-model="group"
            active-class="text--accent-4"
          >
            <v-list-item v-if="user.role == 'admin'" @click=" route('home') ">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
  
            <v-list-item  @click=" route('courses')" >
              <v-list-item-icon>
                <v-icon>mdi-book</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Courses</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="user.role == 'admin'" @click=" route('students')">
              <v-list-item-icon>
                <v-icon>mdi-account-box</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Students</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="user.role == 'admin'" @click=" route('instructors')">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Instructors</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        
      </v-navigation-drawer>
    <v-alert v-if="err" dense type="error"> Something went wrong </v-alert>
  </div>
</template>

<script>
import cookies from "vue-cookies";
import axios from "axios";
export default {
  name: "nav-bar",
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  data() {
    return {
      err: false,
      drawer:false,
      group:null
    };
  },
  methods: {
      route(route){

          let routes = {
              home:"/admin",
              courses:"/courses",
              students:"/students",
              instructors : "/instructors",
              calender : "calender"
          }

          this.$router.push(routes[route]);
      },

    logout() {
      if (cookies.get("token") == undefined) {
        return;
      }
      axios
        .request({
          url: "https://khaledclasses.ml/api/login",
          method: "DELETE",
          data: {
            loginToken: cookies.get("token"),
          },
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          cookies.remove("token");
          this.$store.commit("reset");
          this.$router.push("/");
        })
        .catch(() => {
          this.err = true;
        });
    },
  },
};
</script>

<style lang="sass" scoped>
</style>