<template>
    <div>
        <h3 v-if="assignments.length == 0"> There is no assignment in this course </h3>
        <v-simple-table v-if="assignments.length > 0" >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              Title
            </th>
            <th class="text-left">
              Published date
            </th>
            <th class="text-left">
              Due date
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="assignment in assignments"
            :key="assignment.id" 
          >
            <td> <span @click="viewTask(assignment)" class="task-title"> {{ assignment.title }} </span> </td>
            <td>{{ assignment.published_date }}</td>
            <td> {{ assignment.due_date }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

        <v-btn v-if="user.role == 'instructor'" @click="createModal"> Add assignment </v-btn>
    
    <modal name="createModal" height="auto"> 
        <div class="createModal">
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
        <v-date-picker
          v-model="due_date"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menu.save(due_date)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>

      <v-btn :disabled = disable color = primary @click="addAssignment" > add assignment </v-btn>

  <v-alert
      dense
      outlined
      type="error"
      v-if="post_err"
    >
     Something went wrong
    </v-alert>

        </div> 

    </modal>

    </div>
</template>

<script>
import cookies from "vue-cookies";
import axios from "axios";
    export default {
        name:"course-assignments",
        props: {
            assignments: {
                type: Array,
                required : true
            },
        },
        computed: {
            course() {
                return this.$store.state.selectedCourse; 
            },
            user(){
                return this.$store.state.user;
            }
        },
        data() {
            return {
                menu : false,
                title: "",
                description:"",
                due_date: new Date().toISOString().substr(0, 10),
                post_err:false,
                disable : false
            }
        },
        methods: {
            viewTask(task) {
                this.$store.commit("setTask",task);
                this.$router.push("/task");
                
            },
            createModal() {
                this.post_err=false,
                this.$modal.show("createModal");    
            },
            addAssignment(){

                this.disable = true;

                axios.request({
                    url:"https://khaledclasses.ml/api/tasks",
                    method:"POST",
                    data:{
                        loginToken : cookies.get("token"),
                        courseId : this.course.id,
                        type : "assignment",
                        "due-date":this.due_date,
                        description :this.description,
                        title:this.title

                    },
                    headers:{
                        "Content-Type":"application/json"
                    },
                }).then((response)=>{
                    this.disable=false
                    this.assignments.push(response.data);
                    this.$modal.hide("createModal");


                }).catch(()=>{
                    this.disable=false;
                    this.post_err=true
                })

            }
        },
        
    }
</script>

<style lang="scss" scoped>

.task-title{
   cursor: pointer ;
    text-transform: capitalize;
    color: #0275d8;
    font-size: 1.2em;
    &:hover{
    
    text-decoration: underline;

  }

}
.createModal{

   width: 80%;
   margin: 10%;
}
</style>