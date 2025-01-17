import Vue from "vue";
import VueRouter from "vue-router";
import landingPage from "../views/landing.vue"
import adminPage from "../views/admin.vue"
import coursesPage from "../views/courses.vue"
import coursePage from "../views/course.vue"
import studentsPage from "../views/students.vue"
import instructorsPage from "../views/instructors.vue"
import taskPage from "../views/task.vue";
import submissionPage from "../views/submission.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "landing",
    component: landingPage
  },
  {
    path: "/submission",
    name: "submission",
    component: submissionPage
  },
  {
    path: "/task",
    name: "task",
    component: taskPage
  },
  {
    path: "/students",
    name: "students",
    component: studentsPage
  },
  {
    path: "/instructors",
    name: "instructors",
    component: instructorsPage
  },
  {
    path: "/courses",
    name: "courses",
    component: coursesPage
  },
  {
    path: "/course",
    name: "course-view",
    component: coursePage
  },
  {
    path: "/admin",
    name: "admin",
    component: adminPage
  },
 
];

const router = new VueRouter({
  routes
});

export default router;
