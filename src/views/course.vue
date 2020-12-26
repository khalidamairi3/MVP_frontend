<template>
  <div id="course-view">
    <v-btn v-if="user.role == 'admin'" color="primary" @click="updateModal">
      update
    </v-btn>
    <v-btn v-if="user.role == 'admin'" color="error" @click="deleteModal">
      Delete
    </v-btn>
    <div id="courseDetails">
      <h1 id="title">{{ course.name }}</h1>
      <h3>{{ "Department : " + course.department }}</h3>
      <h3>{{ "Credits: " + course.credits }}</h3>
    </div>
    <modal name="updateCourse">
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
          @click="updateCourse"
        >
          update Course
        </v-btn>

        <v-alert v-if="courseErr" dense type="error">
          Something went wrong
        </v-alert>
      </v-form>
    </modal>
    <modal name="deleteModal">
      <div id="delModal">
        <p>Are you sure you want to delete the course</p>
        <v-btn
          v-if="user.role == 'admin'"
          :disabled="deletedisabled"
          color="error"
          @click="deleteCourse"
        >
          Delete
        </v-btn>
      </div>
    </modal>

    <v-tabs v-model="tab">
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab v-if="user.role == 'admin' || user.role == 'instructor'">
        Students
      </v-tab>
      <v-tab v-if="user.role == 'admin'"> Instructors </v-tab>
      <v-tab v-if="user.role == 'student' || user.role == 'instructor'">
        Assignments
      </v-tab>
      <v-tab v-if="user.role == 'student' || user.role == 'instructor'">
        Quizez
      </v-tab>
      <v-tab v-if="user.role == 'student' || user.role == 'instructor'">
        Exams
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-if="user.role == 'admin' || user.role == 'instructor'">
        <v-card flat>
          <courseStudents :courseId="course.id" />
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="user.role == 'admin'">
        <v-card flat>
          <courseInstructors :courseId="course.id" />
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="user.role == 'student' || user.role == 'instructor'">
        <v-card flat>
          <courseAssignments :assignments="assignments" />
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="user.role == 'student' || user.role == 'instructor'">
        <v-card flat>
          <courseQuizes :quizez="quizez" />
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="user.role == 'student' || user.role == 'instructor'">
        <v-card flat>
          <courseExams :exams="exams" />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import courseStudents from "../components/courseStudents";
import courseInstructors from "../components/courseInstructors";
import courseAssignments from "../components/courseAssignments";
import courseQuizes from "../components/courseQuizez";
import courseExams from "../components/courseExams";
import axios from "axios";
import cookies from "vue-cookies";
export default {
  name: "course-view",
  components: {
    courseStudents,
    courseInstructors,
    courseAssignments,
    courseQuizes,
    courseExams,
  },

  mounted() {
    if (cookies.get("token") == undefined) {
      this.$router.push("/");
      return;
    }
    if (this.user.id == undefined) {
      this.$store.dispatch("start");
      this.$router.push("/courses");
    }
    if (this.course.id != undefined) {
      this.getTasks();
    }
  },

  computed: {
    course() {
      return this.$store.state.selectedCourse;
    },
    user() {
      return this.$store.state.user;
    },
  },
  data() {
    return {
      name: "",
      department: "",
      credits: "",
      courseErr: false,
      disabled: false,
      deletedisabled: false,
      tab: null,
      assignments: [],
      quizez: [],
      exams: [],
      tasks: [],
    };
  },
  methods: {
    updateModal() {
      this.$modal.show("updateCourse");
    },
    deleteModal() {
      this.$modal.show("deleteModal");
    },
    updateCourse() {
      if (this.credits != 0 || this.name != "" || this.deppartment != "") {
        this.disabled = true;
        this.courseErr = false;
        axios
          .request({
            url: "https://khaledclasses.ml/api/courses",
            method: "PATCH",
            data: {
              loginToken: cookies.get("token"),
              courseId: this.course.id,
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
            this.$modal.hide("updateCourse");
            this.$store.commit("setCourse", response.data);
          })
          .catch(() => {
            this.disabled = false;
            this.courseErr = true;
          });
      }
    },
    deleteCourse() {
      this.deletedisabled = true;
      axios
        .request({
          url: "https://khaledclasses.ml/api/courses",
          method: "DELETE",
          data: {
            loginToken: cookies.get("token"),
            courseId: this.course.id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          this.$modal.hide("deleteModal");
          this.$store.dispatch("getCourses");
          this.deletedisabled = false;
          this.$router.push("/courses");
        })
        .catch(() => {
          this.disabled = false;
        });
    },
    getTasks() {
      axios
        .request({
          url: "https://khaledclasses.ml/api/tasks",
          method: "GET",
          params: {
            courseId: this.course.id,
          },
          headers: {
            "Content-Type": "application/json",
            loginToken: cookies.get("token"),
          },
        })
        .then((response) => {
          this.tasks = response.data;
          this.assignments = this.tasks.filter(function (task) {
            return task.type == "assignment";
          });
          this.quizez = this.tasks.filter(function (task) {
            return task.type == "quiz";
          });
          this.exams = this.tasks.filter(function (task) {
            return task.type == "exam";
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
#title {
  border-bottom: 1px solid black;
  padding: 5px;
  justify-self: start;
  width: 100%;
  text-transform: capitalize;
  margin-bottom: 2vh;
}
#course-view {
  margin-left: 10%;
  width: 80%;
  margin-top: 5vh;
}
.course-form {
  width: 80%;
  padding: 5%;
  margin-left: 7.5%;
}
#delModal {
  display: grid;
  height: 100%;
  align-items: center;
  justify-items: center;
}

#courseDetails {
  margin-bottom: 10vh;
}
</style>