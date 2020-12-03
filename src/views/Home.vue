<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <div></div>
  </div>
</template>
<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'aa',
  components: {
    HelloWorld
  },
  methods: {
    action() {
      var str = '23424'
      console.log(1)


    }
  }
}
</script>
