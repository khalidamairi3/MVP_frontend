<template>
  <div>
    <v-alert class="alert" v-if="err" dense type="error">
      Something went wrong
    </v-alert>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="instructors"
      :single-select="singleSelect"
      item-key="name"
      show-select
      class="elevation-1 data-table"
    >
      <template v-slot:top>
        <v-switch
          v-model="singleSelect"
          label="Single select"
          class="pa-3"
        ></v-switch>
      </template>
    </v-data-table>

    <v-btn color="primary" @click="dataModal"> add instructor </v-btn>
    <v-btn color="error" @click="deleteModal"> delete instructors </v-btn>

    <modal height="80%" name="table">
      <div id="instructors-modal">
        <v-data-table
          v-model="selected2"
          :headers="headers"
          :items="notRegistered"
          :single-select="singleSelect2"
          item-key="name"
          show-select
          class="elevation-1 data-table"
        >
          <template v-slot:top>
            <v-switch
              v-model="singleSelect2"
              label="Single select"
              class="pa-3"
            ></v-switch>
          </template>
        </v-data-table>
        <v-btn @click="registerinstructors" color="primary">
          add instructors
        </v-btn>
      </div>
    </modal>
    <modal height="auto" name="delModal">
      <div id="delModal">
        <p>
          Are you sure you want to remove {{ selected.length }} from this
          course?
        </p>

        <v-btn @click="deleteinstructors" color="error"> delete </v-btn>
      </div>
    </modal>
    <v-snackbar v-model="teachErr">
      you should select 1 instructor at least

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="teachErr = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import cookies from "vue-cookies";
export default {
  name: "course-instructors",
  props: {
    courseId: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.getinstructors();
  },
  computed: {
    allinstructors() {
      return this.$store.state.instructors;
    },
  },
  data() {
    return {
      singleSelect: true,
      selected: [],
      singleSelect2: true,
      selected2: [],
      instructors: [],
      teachErr: false,
      notRegistered: [],
      err: false,
      headers: [
        {
          text: "instructors",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Id", value: "id" },
        { text: "Username", value: "username" },
        { text: "Email", value: "email" },
        { text: "Birthdate", value: "birthdate" },
      ],
    };
  },
  methods: {
    dataModal() {
      let registered = this.instructors;
      this.notRegistered = this.allinstructors;

      for (let i = 0; i < registered.length; i++) {
        this.notRegistered = this.notRegistered.filter(function (instructor) {
          return instructor.id != registered[i].id;
        });
      }
      this.$modal.show("table");
    },
    deleteModal() {
      if (this.selected.length == 0) {
        this.teachErr = true;
        return;
      }
      this.$modal.show("delModal");
    },
    getinstructors() {
      axios
        .request({
          url: "https://khaledclasses.ml/api/instructors",
          method: "GET",
          params: {
            courseId: this.courseId,
          },
          headers: {
            "Content-Type": "application/json",
            loginToken: cookies.get("token"),
          },
        })
        .then((response) => {
          this.instructors = response.data;
          this.err = false;
        })
        .catch(() => {
          this.err = true;
        });
    },

    registerinstructors() {
      if (this.selected2.length == 0) {
        this.registerErr = true;
      } else {
        for (let i = 0; i < this.selected2.length; i++) {
          axios
            .request({
              url: "https://khaledclasses.ml/api/instructor-teach",
              method: "POST",
              data: {
                instructorId: this.selected2[i].id,
                loginToken: cookies.get("token"),
                courseId: this.courseId,
              },
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(() => {
              let id = this.selected2[i].id;
              this.instructors.push(this.selected2[i]);
              this.notRegistered = this.notRegistered.filter(function (
                instructor
              ) {
                return instructor.id != id;
              });
              this.$modal.hide("table");
            })
            .catch(() => {
              alert("something went wrong");
            });
        }
      }
    },
    deleteinstructors() {
      if (this.selected.length == 0) {
        this.teachErr = true;
      } else {
        for (let i = 0; i < this.selected.length; i++) {
          axios
            .request({
              url: "https://khaledclasses.ml/api/instructor-teach",
              method: "DELETE",
              data: {
                instructorId: this.selected[i].id,
                loginToken: cookies.get("token"),
                courseId: this.courseId,
              },
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(() => {
              let id = this.selected[i].id;
              this.instructors = this.instructors.filter(function (instructor) {
                return instructor.id != id;
              });

              this.$modal.hide("delModal");
            })
            .catch(() => {
              alert("something went wrong");
            });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#instructors-modal,
#delModal {
  display: grid;
  align-items: center;
  justify-items: center;
}
</style>