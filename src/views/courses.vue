<template>
  <div id="courses-view">
    <v-alert class="alert" v-if="err" dense type="error">
      Something went wrong
    </v-alert>
    <v-btn v-if="user.role == 'admin' " @click="newCourse" id="new"> Create a new course </v-btn>
    <courseCard v-for="course in courses" :key="course.id" :course="course" />
    <modal name="newCourse">
      <v-form class="course-form" ref="form" lazy-validation>
        <v-text-field
          v-model="name"
          label="Course Name"
          required
        ></v-text-field>

        <v-text-field
          v-model="department"
          label="Department"
          required
        ></v-text-field>

        <v-combobox
          v-model="credits"
          :items="[1, 2, 3, 4, 5]"
          label="Credits"
          outlined
          dense
          required
        ></v-combobox>

        <v-btn
          :disabled="disabled"
          color="primary"
          class="mr-4"
          @click="addCourse"
        >
          Add Course
        </v-btn>

        <v-alert v-if="courseErr" dense type="error">
          Something went wrong
        </v-alert>
      </v-form>
    </modal>
  </div>
</template>

<script>
import axios from "axios";
import cookies from "vue-cookies";
import courseCard from "../components/course";
// const wait = ms => new Promise(res => setTimeout(res, ms));
export default {
  name: "courses-view",
  components: {
    courseCard,
  },
    mounted () {

       if(cookies.get("token") == undefined){
           this.$router.push("/");
           return;
       }
      if (this.user.id == undefined){
          this.$store.dispatch("start");
          
      }
  },
  data() {
    return {
      err: false,
      disabled: false,
      name: "",
      department: "",
      credits: 0,
      courseErr: false,
    };
  },
  computed: {
      courses() {
          return this.$store.state.courses; 
      },
      user(){
          return this.$store.state.user
      }
  },
  methods: {
   
    newCourse() {
      this.$modal.show("newCourse");
    },

    addCourse() {
      if (this.credits != 0 && this.name != "" && this.deppartment != "") {
        this.disabled = true;
        this.courseErr = false;
        axios
          .request({
            url: "https://khaledclasses.ml/api/courses",
            method: "POST",
            data: {
              loginToken: cookies.get("token"),
              courseName: this.name,
              credits: this.credits,
              department: this.department,
            },
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.disabled = false;
            this.$modal.hide("newCourse");
            this.courses.push(response.data);
          })
          .catch(() => {
            this.disabled = false;
            this.courseErr = true;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#courses-view {
  margin-top: 10vh;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  column-gap: 5vw;
  row-gap: 5vh;
  align-items: center;
  justify-items: center;
}
#new {
  grid-column: 1/-1;
}
.alert {
  grid-column: 1/-1;
}
.course-form {
  width: 80%;
  padding: 5%;
  margin-left: 7.5%;
}
</style>