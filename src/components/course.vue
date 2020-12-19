<template>
    <div>

          <v-card
    class="mx-auto"
    min-width="300"
  >
   
    <v-card-title class="title">

      {{ course.name }}
    </v-card-title>

    <v-card-subtitle>
      {{  course.department + " department"  }}
    </v-card-subtitle>
    <v-card-text>
        {{'Credits :' + course.credits}}
    </v-card-text>
    <v-card-actions>
      <v-btn @click="viewCourse"
        color="blue lighten-1"
        text
      >
        View
      </v-btn>
      
    </v-card-actions>

  </v-card>

    </div>
</template>

<script>

    export default {
        name : "course-view",
        props: {
            course: {
                type: Object,
                required : true,
            },
        },
        methods: {
            viewCourse() {
                this.$store.commit("setCourse",this.course);
                this.$router.push("/course");
                
            }
        },
        
    }
</script>

<style lang="scss" scoped>
.title{
    text-transform: capitalize;
}
</style>