<template>
  <div id="submission-view">
    <div id="submtission-Details">
      <h1 id="title">{{ task.title }}</h1>
      <h3>{{ "Name :" + submission.name }}</h3>
      <h3>{{ "Submission date : " + submission.date }}</h3>
      <h3>{{ "Grade :" + submission.grade }}</h3>
        <div style="margin-top:5vh">
            
      <p>{{ "Answer : " + submission.content }}</p>

      <p>{{ "Comment :" + submission.comment }}</p>

        </div>

        <div id="grade-form">
            <v-text-field
          v-model="grade"
          label="Grade"
          required
        ></v-text-field>
        <v-btn :disabled = disable @click="submitGrade" color = "primary">
                Submit
        </v-btn>    

        <v-alert v-if="post_err" color="error" outlined >
            Something went wrong
        </v-alert>


        </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import cookies from "vue-cookies"
export default {
  name: "submission-view",
  mounted () {
      if(cookies.get("token") == undefined){
           this.$router.push("/");
           return;
       }
      if (this.user.id == undefined){
          this.$store.dispatch("start");
          this.$router.push("/courses");
          
      };
  },
  computed: {
    submission() {
      return this.$store.state.selectedsubmission;
    },
    task() {
      return this.$store.state.selectedtask;
    },
  },
    data() {
        return {
            grade: null,
            post_err : false,
            disable:false
        }
    },
    methods: {
        submitGrade() {
            this.disable =true;
            this.post_err=false;

            axios.request({
                url:"https://khaledclasses.ml/api/grades",
                method:"POST",
                data:{
                    loginToken : cookies.get("token"),
                    studentId : this.submission.studentId,
                    taskId : this.task.id,
                    grade : this.grade

                },
                headers:{
                    "Content-Type" : "application/json"
                }

            }).then((response)=>{
                let updatedSubmission = this.submission;
                updatedSubmission.grade = response.data.grade;
                this.$store.commit("setSubmission",updatedSubmission);
                this.disable = false;

            }).catch(()=>{
                this.post_err = true;
                this.disable = false;
            })

            
        }
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
#grade-form{
    width:40%
}
#submission-view {
  margin-left: 10%;
  width: 80%;
  margin-top: 5vh;
}
</style>