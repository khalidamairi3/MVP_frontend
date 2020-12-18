<template>
  <div id="students">
    <v-alert class="alert" v-if="err" dense type="error">
      Something went wrong
    </v-alert>
    <v-btn @click="newSteudent" outlined big> New Student </v-btn>
    <v-data-table 
      v-model="selected"
      :headers="headers"
      :items="students"
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
    <div id="options">
        <v-btn @click="updateModal"
    color = "primary" 
    > update</v-btn>

    <v-btn @click="deleteModal"
    color = "error" 
    > delete</v-btn>

    </div>
     <v-snackbar
        v-model="multipleSelect"
      >
        You can edit one student at a time only
  
        <template v-slot:action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="multipleSelect = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>

    <modal height="auto"  :scrollable= true  name="Student">
      <v-form class="student-form" ref="form" lazy-validation>
        <v-text-field
          v-model="name"
          label="Student Name"
          required
        ></v-text-field>

        <v-text-field
            type="password"
          v-model="password"
          label="Password"
          required
        ></v-text-field>
        <v-text-field
          v-model="username"
          label="Username"
          required
        ></v-text-field>
        <v-text-field
          v-model="email"
          label="Email"
          required
        ></v-text-field>

        <v-date-picker
        v-model="birthdate"
        label="Birthdate"
        class="mt-4"
        min="1900-01-01"
        max="2003-12-31"
      ></v-date-picker>


        <v-btn v-if="!update"
          :disabled="disabled"
          color="primary"
          class="mr-4"
          style="justify-self:center"
          @click="addStudent"
        >
          Add Student
        </v-btn>

        <v-btn v-if="update"
          :disabled="updatedisabled"
          color="primary"
          class="mr-4"
          style="justify-self:center"
          @click="updateStudent"
        >
          Update Student
        </v-btn>

        <v-alert v-if="studentErr" dense type="error">
          Something went wrong
        </v-alert>
      </v-form>
    </modal>

     <v-snackbar
        v-model="deleterr"
      >
        Select one student at least
  
        <template v-slot:action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="deleterr = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>

    <modal  name="deleteStudents" > 
        <div id="deleteModal">

            <p> Are you sure you want to delete {{ selected.length }} Students </p> 

        <v-btn :disabled ="deletedisable" @click="deleteStudents"
    color = "error" 
    > delete</v-btn>

    <v-alert v-if="deleteErr" dense type="error">
          Something went wrong
        </v-alert>


        </div>
       



    </modal>



    
    
  </div>
</template>

<script>
import axios from "axios";
import cookies from "vue-cookies";
export default {
  name: "students-view",
  mounted() {
    this.getStudents();
  },
  data() {
    return {
      students: [],
      selected:[],
      singleSelect:false,
      err: false,
      name:"",
      username:"",
      email:"",
      password:"",
      birthdate:"",
      disabled:false,
      studentErr:false,
      updatedisabled:false,
      deletedisable:false,
      update:false,
      multipleSelect:false,
      deleterr:false,
      deleteErr:false,
      headers: [
        {
          text: "Students",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Id", value: "id" },
        { text: "Name", value: "name" },
        { text: "Username", value: "username" },
        { text: "Email", value: "email" },
        { text: "Birthdate", value: "birthdate" },
      ],
    };
  },

  methods: {      
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
          this.students = response.data;
          this.err = false;
        })
        .catch(() => {
          this.err = true;
        });
    },
    newSteudent(){
        this.name="";
        this.username="";
        this.email="";
        this.password="";
        this.birthdate="";
        this.update = false;
        this.$modal.show("Student");        

    },
    updateModal(){
        if(this.singleSelect && this.selected.length ==1){
            this.multipleSelect=false
            this.update = true;
            this.$modal.show("Student");
            

        }
        else{
            this.multipleSelect=true;
        }
        

    },
     deleteModal(){
        if (this.selected.length>0){
            this.$modal.show("deleteStudents");

            
             
        }
        else{
            this.deleterr=true;
        }
    },
    addStudent(){
        this.disabled = true;
        this.studentErr=false;
        axios.request({
            url:"http://127.0.0.1:5000/api/users",
            method:"POST",
            data:{
               loginToken : cookies.get("token"),
               name:this.name,
               birthdate:this.birthdate,
               password:this.password,
               username:this.username,
               email:this.email,
               role : "student" 
            },
            headers:{
                "Content-Type":"application/json"
            }
        }).then((response)=>{
            this.disabled = false;
            this.students.push(response.data);
            this.name="";
            this.username="";
            this.email="";
            this.password="";
            this.birthdate="";
            this.$modal.hide("Student");
        }).catch(()=>{
            this.studentErr=true;
            this.disabled = false;
        })

    },
     updateStudent(){
        this.updatedisabled = true;
        this.studentErr=false;
        axios.request({
            url:"http://127.0.0.1:5000/api/users",
            method:"PATCH",
            data:{
                userId:this.selected[0].id,
                loginToken : cookies.get("token"),
                name:this.name,
                birthdate:this.birthdate,
                password:this.password,
                username:this.username,
                email:this.email,
            },
            headers:{
                "Content-Type":"application/json"
            }
        }).then((response)=>{
            this.updatedisabled = false;
            let objIndex = this.students.findIndex((obj => obj.id == response.data.id));
            this.students.splice(objIndex,1,response.data);
            this.selected[0]=response.data;
            this.name="";
            this.username="";
            this.email="";
            this.password="";
            this.birthdate="";
            this.$modal.hide("Student");
        }).catch(()=>{
            this.studentErr=true;
            this.updatedisabled = false;
        })

    },
    deleteStudents(){
        this.deletedisable = true;
        this.delErr=false;
        for(let i=0; i<this.selected.length ; i++){
        axios.request({
            url:"http://127.0.0.1:5000/api/users",
            method:"DELETE",
            data:{
                userId:this.selected[i].id,
                loginToken : cookies.get("token"),
            },
            headers:{
                "Content-Type":"application/json"
            }
        }).then(()=>{
            let id = this.selected[i].id;
            this.students = this.students.filter(function(student){
                return student.id != id;
            })
        }).catch(()=>{
            this.deleteErr=true;
        })
        }
        this.deletedisable = false;
        this.$modal.hide("deleteStudents")

    },
  },
};
</script>

<style lang="scss" scoped>
#students{
    display: grid;
    justify-items: center;
    
    
}
#deleteModal{
    display: grid;
    justify-items: center;
    align-items: center;
    height: 100%;

}
.student-form{
    padding: 5%;
    display: grid;
}
.data-table{
    width: 80%;
}

</style>