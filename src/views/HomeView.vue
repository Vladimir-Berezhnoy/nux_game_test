<template>
  <div class="home">
    <LoginComponent/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LoginComponent from '@/components/LoginComponent.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'HomeView',
  components: {
    LoginComponent,
  },
});
</script>

<style lang="scss">
.home {
  padding-top: 10vh;
}
</style>
