<template>
    <div class="spinner" v-if="show">
      <div class="spinner-circle"></div>
    </div>
  </template>
  
  <script >
  export default {
    data() {
      return {
        show: false,
      };
    },
    methods: {
      showLoader() {
        this.show = true;
      },
      hideLoader() {
        this.show = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .spinner {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .spinner-circle {
    border: 4px solid #3498db;
    border-top: 4px solid transparent;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>