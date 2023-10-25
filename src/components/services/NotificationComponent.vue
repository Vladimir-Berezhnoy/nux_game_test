<template>
    <div class="notification" :class="notificationClass">
      {{ message }}
      <button @click="closeNotification" class="close-button">×</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        default: 'success',
      },
      closeAfter: {
        type: Number, // Close after a specified duration in milliseconds
      },
    },
    data() {
      return {
        notificationClass: '',
      };
    },
    watch: {
      type(newType, oldType) {
        if (newType !== oldType) {
          this.setNotificationClass(newType);
        }
      },
    },
    created() {
      this.setNotificationClass(this.type);
      if (this.closeAfter) {
        this.scheduleAutoClose();
      }
    },
    methods: {
      setNotificationClass(type) {
        this.notificationClass = `notification notification-${type}`;
      },
      closeNotification() {
        this.$emit('close');
      },
      scheduleAutoClose() {
        setTimeout(() => {
          this.closeNotification();
        }, this.closeAfter);
      },
    },
  };
  </script>
  
  <style scoped>
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 200px;
  }
  
  .notification-success {
    background-color: var(--success-color);
    color: white;
  }
  
  .notification-error {
    background-color: var(--error-color);
    color: white;
  }
  
  .notification-info {
    background-color: orange;
    color: white;
  }

  .close-button {
    cursor: pointer;
    background: none;
    border: none;
    font-size: 16px;
    line-height: 1;
    padding: 5px;
    margin: -5px;
  }
  </style>