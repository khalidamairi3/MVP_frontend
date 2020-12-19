import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import cookies from "vue-cookies"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user :{},
    instructors:[],
    students : [],
    courses :[],
    selectedCourse:{}
  },
  mutations: {
    setUser: function (state, user) {
      state.user = user;
    },
    setCourse: function (state, course) {
      state.selectedCourse = course;
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
    
  },
  actions: {
    getCourses() {
      axios
        .request({
          url: "http://127.0.0.1:5000/api/courses",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            loginToken: cookies.get("token"),
          },
        })
        .then((response) => {
          this.commit("updateCourses",response.data);
        })
        .catch(() => {
          alert("Something went wrong")
        });
    },

    getStudents() {
      axios
        .request({
          url: "http://127.0.0.1:5000/api/students",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            loginToken: cookies.get("token"),
          },
        })
        .then((response) => {
          this.commit("updateStudents",response.data);
        })
        .catch(() => {

        });
    }


  },
  modules: {}
});
