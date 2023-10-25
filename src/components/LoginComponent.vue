<template>
  <form class="login-form" @submit.prevent="login">
    <div class="login-form-header">Login</div>
    <div class="login-form-wrapper">
      <label class="login-form-label"
        >Username:
        <input
          type="text"
          class="login-form-input"
          v-model="formData.username"
          @input="validateUsername"
          :class="{ 'login-form-input-error': error }"
        />
      </label>

      <label class="login-form-label"
        >Phone Number:
        <input
          type="text"
          class="login-form-input"
          v-model="formData.phone"
          @input="validatePhone"
          :class="{ 'login-form-input-error': error }"
        />
      </label>

      <button type="submit" class="login-form-button" :disabled="!isValid">
        Login
      </button>

      <LoaderComponent ref="spinner" />
      <NotificationComponent
        v-if="showNotification"
        :message="notificationMessage"
        :type="notificationType"
        @close="closeNotification"
        :closeAfter="4000"
      />
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { user } from "@/models/user.model";
import LoaderComponent from "@/components/services/LoaderComponent.vue";
import NotificationComponent from "@/components/services/NotificationComponent.vue";
import { handleLocalStorage } from "@/directives/localStorageHandle";
import router from "@/router";

export default Vue.extend({
  name: "LoginComponent",
  components: {
    LoaderComponent,
    NotificationComponent
  },
  data() {
    return {
      formData: {
        username: "",
        phone: "",
      },

      isValid: false,
      error: false,
      user: Object as () => user,

      showNotification: false,
      notificationMessage: '',
      notificationType: '',
    };
  },
  watch: {
    formData: {
      handler(val) {
        val.phone.length > 0 && val.username.length > 0
          ? (this.isValid = true)
          : (this.isValid = false);
        this.error ? (this.error = false) : this.error;
      },
      deep: true,
    },
  },
  created() {
    if (localStorage.getItem("nux-game-uid") !== null) {
      router.push({ name: 'profile'})
    }
  },
  methods: {
    validateUsername() {
      // Allow only letters and space in the username
      this.formData.username = this.formData.username.replace(
        /[^a-zA-Z\s]/g,
        ""
      );
    },
    validatePhone() {
      // Allow only numbers and symbols in the phone number
      this.formData.phone = this.formData.phone.replace(
        /[^A-Za-z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g,
        ""
      );
    },
    login() {
      // Simulate an API request to fetch user data
      this.showLoader();
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((users) => {
          const foundUser = users.find((user: user) => {
            console.log(user.username, user.phone);
            return (
              user.username == this.formData.username &&
              user.phone == this.formData.phone
            );
          });
          this.hideLoader();
          if (foundUser) {
            this.error = false;
            handleLocalStorage('set', foundUser.id);
            router.push({ name: 'profile'})
          } else {
            this.error = true;
            this.showErrorNotification();
          }
        });
    },
    // Show the loader
    showLoader() {
      // eslint-disable-next-line
      (this.$refs.spinner as any).showLoader();
    },
    // hideLoader the loader
    hideLoader() {
      // eslint-disable-next-line
      (this.$refs.spinner as any).hideLoader();
    },
    // showSuccessNotification() {
    //   this.notificationMessage = 'Successful login, redirecting to another page...';
    //   this.notificationType = 'success';
    //   this.showNotification = true;
    // },
    showErrorNotification() {
      this.notificationMessage = 'Login error!';
      this.notificationType = 'error';
      this.showNotification = true;
    },
    closeNotification() {
      this.showNotification = false;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login {
  &-form {
    border-radius: 5px;
    background-color: var(--grey-300);
    max-width: 448px;
    overflow: hidden;
    margin: 0 auto;
    &-header {
      background-color: var(--grey-400);
      padding: 15px 25px;
      text-align: center;
    }
    &-wrapper {
      padding: 15px 25px 30px;
      text-align: left;
    }
    &-label {
      margin-bottom: 20px;
    }
    &-input {
      width: 100%;
      border-radius: 5px;
      background-color: #fff;
      color: rgb(26, 26, 26);
      border: none;
      height: 38px;
      font-size: 18px;
      padding: 10px;
      &-error {
        border: 1px solid var(--error-color);
      }
    }
    &-button {
      background-color: var(--success-color);
      width: 100%;
      border-radius: 5px;
      color: #fff;
      padding: 10px 20px;
      font-size: 18px;
      &:disabled {
        cursor: default;
        background-color: #a5d6a7;
        color: #eeeeee;
      }
    }
  }
}
</style>
