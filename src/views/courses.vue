<template>
    <div id="courses-view">
        <v-btn @click="newCourse" id="new"> Create a new course </v-btn>
        <courseCard v-for=" course in courses " :key="course.id" :course = course />
        <modal name="newCourse" >

            <v-form class="course-form"
    ref="form"
    lazy-validation
  >
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
          :items="[1,2,3,4,5]"
          label="Credits"
          outlined
          dense
          required
        ></v-combobox>



    <v-btn
      :disabled="disabled"
      color="primary"
      class="mr-4"
      @click="addCourse"
    >
      Add Course
    </v-btn>
     
    <v-alert v-if="courseErr"
      dense
      type="error"
    >
     Something went wrong 
    </v-alert>
    
  </v-form>
    


        </modal>
    </div>
</template>

<script>
import axios from "axios";
import cookies from "vue-cookies";
import courseCard from "../components/course"
    export default {
        name : "courses-view",
        components: {
            courseCard,
        },
        mounted () {
            this.getCourses();
        },
        data() {
            return {
                courses: [],
                err:false,
                disabled:false,
                name:"",
                department:"",
                credits:0,
                courseErr : false
            }
        },
        methods: {
            getCourses() {

                axios.request({
              url:"http://127.0.0.1:5000/api/courses",
              method : "GET",
              headers:{
                        "Content-Type": "application/json",
                        "loginToken":cookies.get("token")
                    }

          }).then((response)=>{
              this.courses = response.data
              
              
          }).catch(()=>{
            this.err = true;
          })
                
                
            },
             newCourse(){
            this.$modal.show('newCourse')

        },
        
        addCourse(){
            if(this.credits != 0 && this.name != "" && this.deppartment != ""){
                this.disabled=true;
                this.courseErr = false;
            axios.request({
                url:"http://127.0.0.1:5000/api/courses",
                method:"POST",
                data:{
                    loginToken:cookies.get("token"),
                    courseName : this.name,
                    credits:this.credits,
                    department:this.department
                },
                headers:{
                    "Content-Type": "application/json",
                }
            }).then((response)=>{
                this.disabled=false;
                this.$modal.hide('newCourse');
                this.courses.push(response.data);

            }).catch(()=>{
                this.disabled=false;
                this.courseErr = true;
            })}
        },
        }

        
        
    }
</script>

<style lang="scss" scoped>

#courses-view{
    margin-top:10vh;
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(300px,1fr));
    column-gap: 5vw;
    row-gap: 5vh;
    align-items: center;
    justify-items: center;
}
#new{
    grid-column: 1/-1;
}

.course-form{
    
    width: 80%;
    padding: 5%;
    margin-left: 7.5% ;
}
</style>