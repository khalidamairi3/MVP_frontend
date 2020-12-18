import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import landingPage from "../views/landing.vue"
import adminPage from "../views/admin.vue"
import coursesPage from "../views/courses.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "landing",
    component: landingPage
  },
  {
    path: "/courses",
    name: "courses",
    component: coursesPage
  },
  {
    path: "/admin",
    name: "admin",
    component: adminPage
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
