<template>
  <div>
      <v-alert class="alert" v-if="err" dense type="error">
      Something went wrong
    </v-alert>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="students"
      :single-select="singleSelect"
      item-key="name"
      show-select
      class="elevation-1 data-table"
    >
      <template v-if="user.role=='admin'" v-slot:top>
        <v-switch
          v-model="singleSelect"
          label="Single select"
          class="pa-3"
        ></v-switch>
      </template>
    </v-data-table>

    <v-btn color="primary" v-if="user.role == 'admin'" @click="dataModal" > add student  </v-btn>
    <v-btn color="error" v-if="user.role == 'admin'" @click="deleteModal" > delete students  </v-btn>

    

    <modal height="80%" name="table"> 

        <div id="students-modal">
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
    <v-btn @click="registerStudents" color="primary"> add students </v-btn>

        </div>


    </modal>
    <modal height = "auto" name="delModal">
        <div id="delModal">
            <p>  Are you sure you want to remove {{ selected.length }} from this course?</p>
            
            <v-btn @click="deleteStudents" color = "error"> delete </v-btn>
        </div>

    </modal>
    <v-snackbar
        v-model="registerErr"
      >
        you should select 1 student at least 
  
        <template v-slot:action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="registerErr = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>


      
  </div>
</template>

<script>
import axios from "axios";
import cookies from "vue-cookies"
export default {
  name: "course-students",
  props: {
    courseId: {
      type: Number,
      required: true,
    },
  },
  mounted () {
      this.getStudents();
  },
  computed: {
      allstudents() {
          return this.$store.state.students ;
      },
     
          user() {
              return this.$store.state.user ;
          }
      ,
  },
  data() {
    return {
      singleSelect: true,
      selected: [],
      singleSelect2: true,
      selected2: [],
      students: [],
      registerErr:false,
      notRegistered :[],
      err:false,
      headers: [
        {
          text: "Students",
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
      dataModal(){
          let registered = this.students
          this.notRegistered = this.allstudents

          for(let i=0 ; i < registered.length ; i++){
              this.notRegistered = this.notRegistered.filter(function(student){ 
                  return student.id != registered[i].id;
               });
          }
          this.$modal.show("table");



      },
      deleteModal(){

        if (this.selected.length == 0 ){
            this.registerErr = true;
            return
        }
          this.$modal.show("delModal")

      },
       getStudents() {
      axios
        .request({
          url: "https://khaledclasses.ml/api/students",
          method: "GET",
          params:{
              courseId:this.courseId
          },
          headers: {
            "Content-Type": "application/json",
            loginToken: cookies.get("token"),
          },
        })
        .then((response) => {
          this.students = response.data;
          this.err = false;
        })
        .catch(() => {
          this.err = true;
        });
    },
    
    registerStudents(){
        if (this.selected2.length == 0 ){
            this.registerErr = true;
        }
        else{

            for(let i=0; i<this.selected2.length ; i++){
        axios.request({
            url:"https://khaledclasses.ml/api/student-register",
            method:"POST",
            data:{
                studentId:this.selected2[i].id,
                loginToken : cookies.get("token"),
                courseId:this.courseId
            },
            headers:{
                "Content-Type":"application/json"
            }
        }).then(()=>{
            let id = this.selected2[i].id;
            this.students.push(this.selected2[i])
            this.notRegistered = this.notRegistered.filter(function(student){
                return student.id != id;
            })
            this.$modal.hide("table");
        }).catch(()=>{
            alert("something went wrong")
        })
        }
            
            




        }

    },
    deleteStudents(){

        if (this.selected.length == 0 ){
            this.registerErr = true;
        }
        else{

            for(let i=0; i<this.selected.length ; i++){
        axios.request({
            url:"https://khaledclasses.ml/api/student-register",
            method:"DELETE",
            data:{
                studentId:this.selected[i].id,
                loginToken : cookies.get("token"),
                courseId:this.courseId
            },
            headers:{
                "Content-Type":"application/json"
            }
        }).then(()=>{
            let id = this.selected[i].id;
            this.students = this.students.filter(function(student){
                return student.id != id;
                
            })
            
            this.$modal.hide("delModal");
        }).catch(()=>{
            alert("something went wrong")
        })
        }
            
            




        }



    }

  },
};
</script>

<style lang="scss" scoped>

#students-modal,#delModal{

    display: grid;
    align-items: center;
    justify-items: center;



}
</style>