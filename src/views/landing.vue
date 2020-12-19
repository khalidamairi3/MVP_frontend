<template>
  <div id="landing">
 

       <v-form
    ref="form"
    lazy-validation
    class="login"
  >
    <v-text-field
      v-model="email"
      label="Email"
      required
    ></v-text-field>

    <v-text-field
        type ="password"
      v-model="password"
      label="Password"
      required
    ></v-text-field>

    

    <v-btn :disabled = disabled
      color="success"
      class="mr-4"
      @click="login"
    >
      Login
    </v-btn>
    <v-alert v-if="err"
      dense
      type="error"
    >
     Something went wrong 
    </v-alert>

    

  </v-form>
    
  </div>
</template>

<script>
import axios from "axios";
import cookies from "vue-cookies";
export default {
  name: "landing-page",
  data() {
      return {
          email: "",
          password:"",
          disabled:false,
          err:false
      }
  },
  methods: {
      login() {
          this.disabled=true;
          this.err = false;
          axios.request({
              url:"http://127.0.0.1:5000/api/login",
              method : "POST",
              data:{
                  email:this.email,
                  password : this.password
              },
              headers:{
                        "Content-Type": "application/json",
                    }

          }).then((response)=>{
              cookies.set("token",response.data.loginToken)
              this.$store.commit("setUser", response.data);
              this.$store.dispatch("getCourses");
              this.disabled=false;
              if(response.data.role=="admin"){
                this.$store.dispatch("getStudents");
                this.$router.push("/admin");
              }
              else if(response.data.role=="instructor"){
                this.$store.dispatch("getStudents");
                this.$router.push("/instructor");
              }
              else{
                 this.$router.push("/student");
              }
              
          }).catch(()=>{
            this.disabled=false;
            this.err = true;
          })
          
      }
  },
};
</script>

<style lang="scss" scoped>

.login{
    width: 50%;
    justify-self: center;
    align-self: center;
}
#landing{
    height: 100%;
    display: grid;

}
</style>