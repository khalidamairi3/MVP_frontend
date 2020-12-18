<template>
    <div id="courses-view">

        <courseCard v-for=" course in courses " :key="course.id" :course = course />

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
                
                
            }
        },
        
        
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

</style>