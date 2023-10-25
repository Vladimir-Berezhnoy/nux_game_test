<template>
  <button @click="logout()" class="logout">Logout</button>
</template>

<script lang="ts">
import Vue from "vue";
import { handleLocalStorage } from "@/directives/localStorageHandle";
import router from "@/router";

export default Vue.extend({
  name: "LogoutComponent",
  data() {
    return {};
  },

  methods: {
    logout() {
      handleLocalStorage("remove", "");
      router.push({ name: 'home'})
    },
  },
});
</script>

<style lang="scss">
.logout {
  margin-left: auto;
  background-color: var(--error-color);
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>
