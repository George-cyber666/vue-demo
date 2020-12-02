<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div></div>
  </div>
</template>
<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "home",
  components: {
    HelloWorld
  },
  methods: {
    action () {
      console.log(1);
    }
  }
}
</script>
