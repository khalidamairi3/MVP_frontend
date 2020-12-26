import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import cookies from "vue-cookies"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    instructors: [],
    students: [],
    courses: [],
    selectedCourse: {},
    selectedtask: {},
    selectedsubmission: {}
  },
  mutations: {
    setUser: function (state, user) {
      state.user = user;
    },
    setCourse: function (state, course) {
      state.selectedCourse = course;
    },
    setTask: function (state, task) {
      state.selectedtask = task;
    },
    setSubmission: function (state, submission) {
      state.selectedsubmission = submission;
    },
    updateInstructors: function (state, data) {
      state.instructors = data;
    },
    updateStudents: function (state, data) {
      state.students = data;
    },
    updateCourses: function (state, data) {
      state.courses = data;
    },
    reset: function (state) {
      state.courses = [];
      state.students = [];
      state.instructors = [];
      state.selectedsubmission = {};
      state.selectedtask = {};
      state.selectedCourse = {};
      state.user = {}


    },


  },
  actions: {

    start() {
      axios.request({
        url: "https://khaledclasses.ml/api/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          loginToken: cookies.get("token"),
        },
      })
        .then((response) => {
          this.commit("setUser", response.data);
          this.dispatch("getCourses");
          if (response.data.role == "admin") {
            this.$store.dispatch("getStudents");
            this.$store.dispatch("getInstructors");
          }
        })
        .catch(() => {
          alert("Something went wrong")
        });


    },

    getCourses() {
      axios
        .request({
          url: "https://khaledclasses.ml/api/courses",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            loginToken: cookies.get("token"),
          },
        })
        .then((response) => {
          this.commit("updateCourses", response.data);
        })
        .catch(() => {
          alert("Something went wrong")
        });
    },

    getStudents() {
      axios
        .request({
          url: "https://khaledclasses.ml/api/students",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            loginToken: cookies.get("token"),
          },
        })
        .then((response) => {
          this.commit("updateStudents", response.data);
        })
        .catch(() => {

        });
    },
    getInstructors() {
      axios
        .request({
          url: "https://khaledclasses.ml/api/instructors",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            loginToken: cookies.get("token"),
          },
        })
        .then((response) => {
          this.commit("updateInstructors", response.data);
        })
        .catch(() => {
          alert("somthing went wrong");
        });
    },


  },
  modules: {}
});
