<template>
    <div id="admin">
        <v-card
            elevation="10"
            shaped
        >
        <v-card-title> Courses </v-card-title>
        <v-card-text> view all courses in the system </v-card-text>
        <v-card-actions>
      <v-btn
      color="blue lighten-1"
        text
        @click="viewCourses"
      >
        View Courses 
      </v-btn>
    </v-card-actions>
        
        
        
        </v-card>
         <v-card
            elevation="10"
            shaped
        >
        <v-card-title> Students </v-card-title>
        <v-card-text> view all students in the system </v-card-text>
        <v-card-actions>
      <v-btn
      color="blue lighten-1"
        text
        @click="viewStudents"
      >
        View Students 
      </v-btn>
    </v-card-actions>
        
        
        
        </v-card>
         <v-card
            elevation="10"
            shaped
        >
        <v-card-title> Instructors </v-card-title>
        <v-card-text> view all instructors in the system </v-card-text>
        <v-card-actions>
      <v-btn
      color="blue lighten-1"
        text
        @click="viewInstructors"
      >
        View Instructors
      </v-btn>
    </v-card-actions>
        
        
        
        </v-card>

    </div>
</template>

<script>
import cookies from "vue-cookies";
    export default {
        name: "admin-view",
        mounted () {
            if(cookies.get("token") == undefined){
           this.$router.push("/");
           return;
       }
      if (this.user.id == undefined){
          this.$store.dispatch("start");
          
      };
        },
        methods: {
            viewCourses() {

                this.$router.push("/courses");
                
            },
             viewInstructors() {

                this.$router.push("/instructors");
                
            },
              viewStudents () {

                this.$router.push("/students");
                
            }
        },
        computed: {
            user() {
                return this.$store.state.user; 
            }
        },
        
        
    }
</script>

<style lang="scss" scoped>
#admin{
    margin-top : 10vh;
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
    align-items: center;
    justify-items: center;
    row-gap: 5vh;
}
</style>