<template>
  <div class="profile-wrapper">
    <div>
      <ProfileComponent/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ProfileComponent from '@/components/ProfileComponent.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'ProfileView',
  components: {
    ProfileComponent,
  },
});
</script>

<style lang="scss">
.profile-wrapper {
  padding: 15px;
}

</style>
