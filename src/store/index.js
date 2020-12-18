import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user :{},
    instructors:[],
    studetns : [],
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
    updateStudetns: function (state, data) {
      state.studetns = data;
    },
    updateCourses: function (state, data) {
      state.courses = data;
    },


    
  },
  actions: {},
  modules: {}
});
