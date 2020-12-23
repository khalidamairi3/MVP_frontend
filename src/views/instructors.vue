<template>
  <div id="instructors">
    <v-alert class="alert" v-if="err" dense type="error">
      Something went wrong
    </v-alert>
    <v-btn @click="newSteudent" outlined big> New instructor </v-btn>
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
        You can edit one instructor at a time only
  
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

    <modal height="auto"  :scrollable= true  name="instructor">
      <v-form class="instructor-form" ref="form" lazy-validation>
        <v-text-field
          v-model="name"
          label="instructor Name"
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
          @click="addinstructor"
        >
          Add instructor
        </v-btn>

        <v-btn v-if="update"
          :disabled="updatedisabled"
          color="primary"
          class="mr-4"
          style="justify-self:center"
          @click="updateinstructor"
        >
          Update instructor
        </v-btn>

        <v-alert v-if="instructorErr" dense type="error">
          Something went wrong
        </v-alert>
      </v-form>
    </modal>

     <v-snackbar
        v-model="deleterr"
      >
        Select one instructor at least
  
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

    <modal  name="deleteinstructors" > 
        <div id="deleteModal">

            <p> Are you sure you want to delete {{ selected.length }} instructors </p> 

        <v-btn :disabled ="deletedisable" @click="deleteinstructors"
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
// const wait = ms => new Promise(res => setTimeout(res, ms));
export default {
  name: "instructors-view",
  async mounted () {
     if(cookies.get("token") == undefined){
           this.$router.push("/");
           return;
       }
      if (this.user.id == undefined){
          this.$store.dispatch("start");
          this.$router.push("/courses");
          
      }
    //   if (this.instructors == undefined || this.instructors.length ==0 ){
    //       this.$store.dispatch("getInstructors");
    //       await wait(200)
    //   }
  },
  computed: {
        instructors() {
          return this.$store.state.instructors; 
      },
      user(){
          return this.$store.state.user
      }
  },
  data() {
    return {
      selected:[],
      singleSelect:false,
      err: false,
      name:"",
      username:"",
      email:"",
      password:"",
      birthdate:"",
      disabled:false,
      instructorErr:false,
      updatedisabled:false,
      deletedisable:false,
      update:false,
      multipleSelect:false,
      deleterr:false,
      deleteErr:false,
      headers: [
        {
          text: "instructors",
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
    newSteudent(){
        this.name="";
        this.username="";
        this.email="";
        this.password="";
        this.birthdate="";
        this.update = false;
        this.$modal.show("instructor");        

    },
    updateModal(){
        if(this.singleSelect && this.selected.length ==1){
            this.multipleSelect=false
            this.update = true;
            this.$modal.show("instructor");
            

        }
        else{
            this.multipleSelect=true;
        }
        

    },
     deleteModal(){
        if (this.selected.length>0){
            this.$modal.show("deleteinstructors");

            
             
        }
        else{
            this.deleterr=true;
        }
    },
    addinstructor(){
        this.disabled = true;
        this.instructorErr=false;
        axios.request({
            url:"https://khaledclasses.ml/api/users",
            method:"POST",
            data:{
               loginToken : cookies.get("token"),
               name:this.name,
               birthdate:this.birthdate,
               password:this.password,
               username:this.username,
               email:this.email,
               role : "instructor" 
            },
            headers:{
                "Content-Type":"application/json"
            }
        }).then((response)=>{
            this.disabled = false;
            this.instructors.push(response.data);
            this.name="";
            this.username="";
            this.email="";
            this.password="";
            this.birthdate="";
            this.$modal.hide("instructor");
        }).catch(()=>{
            this.instructorErr=true;
            this.disabled = false;
        })

    },
     updateinstructor(){
        this.updatedisabled = true;
        this.instructorErr=false;
        axios.request({
            url:"https://khaledclasses.ml/api/users",
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
            let objIndex = this.instructors.findIndex((obj => obj.id == response.data.id));
            this.instructors.splice(objIndex,1,response.data);
            this.selected[0]=response.data;
            this.name="";
            this.username="";
            this.email="";
            this.password="";
            this.birthdate="";
            this.$modal.hide("instructor");
        }).catch(()=>{
            this.instructorErr=true;
            this.updatedisabled = false;
        })

    },
    deleteinstructors(){
        this.deletedisable = true;
        this.delErr=false;
        for(let i=0; i<this.selected.length ; i++){
        axios.request({
            url:"https://khaledclasses.ml/api/users",
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
            this.instructors = this.instructors.filter(function(instructor){
                return instructor.id != id;
            })
        }).catch(()=>{
            this.deleteErr=true;
        })
        }
        this.deletedisable = false;
        this.$modal.hide("deleteinstructors")

    },
  },
};
</script>

<style lang="scss" scoped>
#instructors{
    display: grid;
    justify-items: center;
    
    
}
#deleteModal{
    display: grid;
    justify-items: center;
    align-items: center;
    height: 100%;

}
.instructor-form{
    padding: 5%;
    display: grid;
}
.data-table{
    width: 80%;
}

</style>