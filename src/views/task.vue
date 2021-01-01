<template>
  <div id="task-view">
    <v-btn
      v-if="user.role == 'instructor'"
      color="primary"
      @click="updateModal"
    >
      update
    </v-btn>
    <v-btn v-if="user.role == 'instructor'" color="error" @click="deleteModal">
      Delete
    </v-btn>
    <div id="taskDetails">
      <h1 class="title">{{ task.title }}</h1>
      <h3>{{ "Due date : " + task.due_date }}</h3>
      <h3>{{ task.description }}</h3>
    </div>
    <modal height="auto" name="updatetask">
      <v-form class="task-form" ref="form" lazy-validation>
        <v-text-field
          v-model="title"
          label="Assignment Title"
          required
        ></v-text-field>

        <v-textarea
          outlined
          name="input-7-4"
          label="Assignment Description"
          v-model="description"
        ></v-textarea>

        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="due_date"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="due_date"
              label="due-date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="due_date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(due_date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>

        <v-btn :disabled="disabled" color="primary" @click="updatetask">
          update
        </v-btn>

        <v-alert dense outlined type="error" v-if="post_err">
          Something went wrong
        </v-alert>
      </v-form>
    </modal>
    <modal height="auto" name="deleteModal">
      <div id="delModal">
        <p>Are you sure you want to delete the task</p>
        <v-btn
          v-if="user.role == 'instructor'"
          :disabled="deletedisabled"
          color="error"
          @click="deletetask"
        >
          Delete
        </v-btn>
      </div>
    </modal>

    <div
      id="submtission-Details"
      v-if="submissions.length == 1 && user.role == 'student'"
    >
      <h1 class="title">Your submission</h1>
      <h3>{{ "Name :" + submissions[0].name }}</h3>
      <h3>{{ "Submission date : " + submissions[0].date }}</h3>
      <h3>{{ "Grade :" + submissions[0].grade }}</h3>

      <div style="margin-top: 5vh">
        <p>{{ "Answer : " + submissions[0].content }}</p>

        <p>{{ "Comment :" + submissions[0].comment }}</p>

        <v-btn color="primary" @click="updateSubmission">
          Edit Submission</v-btn
        >
      </div>
    </div>
    <v-btn v-if="submissions.length == 0 && user.role=='student'" color="primary" @click="Submission">
      Submit
    </v-btn>
    <v-simple-table
      id="submission-table"
      v-if="submissions.length > 0 && user.role == 'instructor'"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Published date</th>
            <th class="text-left">Due date</th>
            <th class="text-left">status</th>
            <th class="text-left">grade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="submission in submissions" :key="submission.id">
            <td>
              <span
                @click="viewSubmission(submission)"
                class="submission-title"
              >
                {{ submission.name }}
              </span>
            </td>
            <td>{{ submission.date }}</td>
            <td>{{ task.due_date }}</td>
            <td>
              <span
                class="red--text"
                v-if="new Date(submission.date) > new Date(task.due_date)"
              >
                Late
              </span>
            </td>
            <td>
              <span v-if="submission.grade"> {{ submission.grade }} </span>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <modal height="50%" name="submission-modal">
      <div style="width: 80%; margin: 10%">
        <v-text-field
          v-model="content"
          label="Submission"
          required
        ></v-text-field>

        <v-text-field v-model="comment" label="Comment" required></v-text-field>

        <v-btn
          :disabled="submitDisabled"
          color="primary"
          @click="postSubmition"
        >
          Submit
        </v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import axios from "axios";
import cookies from "vue-cookies";
export default {
  name: "task-view",
  components: {},

  mounted() {
    if (cookies.get("token") == undefined) {
      this.$router.push("/");
      return;
    }
    if (this.user.id == undefined) {
      this.$store.dispatch("start");
      this.$router.push("/courses");
      return;
    }
    if(this.user.role=='admin'){
        this.$router.push("/admin");
        return;
    }
    if (this.task.id != undefined && this.user.role != "admin") {
      this.getSubmissions();
    }
  },

  computed: {
    task() {
      return this.$store.state.selectedtask;
    },
    user() {
      return this.$store.state.user;
    },
  },
  data() {
    return {
      menu: false,
      title: "",
      description: "",
      due_date: "",
      update: false,
      post_err: false,
      disabled: false,
      deletedisabled: false,
      tab: null,
      submissions: [],
      content: "",
      comment: "",
      submitDisabled: false,
    };
  },
  methods: {
    viewSubmission(submission) {
      this.$store.commit("setSubmission", submission);
      this.$router.push("/submission");
    },
    updateSubmission() {
      this.update = true;
      this.$modal.show("submission-modal");
    },
    Submission() {
      this.update = false;
      this.$modal.show("submission-modal");
    },
    postSubmition() {
      this.submitDisabled = true;
      if (!this.update) {
        axios
          .request({
            url: "https://khaledclasses.ml/api/submit",
            method: "POST",
            data: {
              loginToken: cookies.get("token"),
              taskId: this.task.id,
              content: this.content,
              comment: this.comment,
            },
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.disabled = false;
            this.$modal.hide("submission-modal");
            this.submission.push(response.data);
            this.submitDisabled = false;
          })
          .catch(() => {
            this.submitDisabled = false;
          });
      } else {
        axios
          .request({
            url: "https://khaledclasses.ml/api/submit",
            method: "PATCH",
            data: {
              loginToken: cookies.get("token"),
              taskId: this.task.id,
              content: this.content,
              comment: this.comment,
            },
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.disabled = false;
            this.$modal.hide("submission-modal");
            this.submission[0] = response.data;
            this.submitDisabled = false;
          })
          .catch(() => {
            this.submitDisabled = false;
          });
      }
    },
    updateModal() {
      this.$modal.show("updatetask");
    },
    deleteModal() {
      this.$modal.show("deleteModal");
    },
    updatetask() {
      if (this.title != 0 || this.description != "" || this.due_date != "") {
        this.disabled = true;
        this.post_err = false;
        axios
          .request({
            url: "https://khaledclasses.ml/api/tasks",
            method: "PATCH",
            data: {
              loginToken: cookies.get("token"),
              taskId: this.task.id,
              title: this.title,
              description: this.description,
              "due-date": this.due_date,
            },
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.disabled = false;
            this.$modal.hide("updatetask");
            this.$store.commit("setTask", response.data);
          })
          .catch(() => {
            this.disabled = false;
            this.post_err = true;
          });
      }
    },
    deletetask() {
      this.deletedisabled = true;
      axios
        .request({
          url: "https://khaledclasses.ml/api/tasks",
          method: "DELETE",
          data: {
            loginToken: cookies.get("token"),
            taskId: this.task.id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          this.$modal.hide("deleteModal");
          this.deletedisabled = false;
          this.$router.push("/course");
        })
        .catch(() => {
          this.disabled = false;
        });
    },
    getSubmissions() {
      axios
        .request({
          url: "https://khaledclasses.ml/api/submit",
          method: "GET",
          params: {
            taskId: this.task.id,
          },
          headers: {
            "Content-Type": "application/json",
            loginToken: cookies.get("token"),
          },
        })
        .then((response) => {
          this.submissions = response.data;
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  border-bottom: 1px solid black;
  padding: 5px;
  justify-self: start;
  width: 100%;
  text-transform: capitalize;
  margin-bottom: 2vh;
}
#task-view {
  margin-left: 10%;
  width: 80%;
  margin-top: 5vh;
}
.task-form {
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

#taskDetails {
  margin-bottom: 10vh;
}

.submission-title {
  cursor: pointer;
  text-transform: capitalize;
  color: #0275d8;
  font-size: 1.2em;
  &:hover {
    text-decoration: underline;
  }
}
</style>