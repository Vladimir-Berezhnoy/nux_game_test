<template>
  <div>
    <LogoutComponent />
    <div class="profile" v-if="isReady.userInfo && isReady.todoInfo">
      <div class="profile-info-container">
        <div class="profile-info">
          <h1>User Information</h1>
          <h2>{{ currentUser.name }}</h2>
          <p>Username: {{ currentUser.username }}</p>
          <p>Email: {{ currentUser.email }}</p>
          <h3>Address</h3>
          <div v-if="currentUser.address">
            <p>Street: {{ currentUser.address.street }}</p>
            <p>Suite: {{ currentUser.address.suite }}</p>
            <p>City: {{ currentUser.address.city }}</p>
            <p>Zipcode: {{ currentUser.address.zipcode }}</p>
          </div>
          <h3>Contact</h3>
          <p>Phone: {{ currentUser.phone }}</p>
          <p>Website: {{ currentUser.website }}</p>
          <h3>Company</h3>
          <div v-if="currentUser.company">
            <p>Name: {{ currentUser.company.name }}</p>
            <p>Catch Phrase: {{ currentUser.company.catchPhrase }}</p>
            <p>Business: {{ currentUser.company.bs }}</p>
          </div>
        </div>

        <div class="create-todo">
          <h2>Add todo</h2>
          <label class="form-label"
            >User ID:
            <input v-model="newTodo.userId" type="number" />
          </label>

          <label class="form-label"
            >Title:
            <input v-model="newTodo.title" type="text" />
          </label>

          <button
            @click="addTodo"
            :disabled="newTodo.userId.length < 1 || newTodo.title.length < 1"
          >
            Add
          </button>
        </div>
      </div>

      <div class="filters">
        <label>Search:<input v-model="filter.search" type="text" /></label>

        <label
          >Status:<select v-model="filter.statusFilter">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="uncompleted">Uncompleted</option>
            <option value="favorites">Favorites</option>
          </select>
        </label>

        <label
          >User:<select v-model="filter.userFilter">
            <option value="all">All Users</option>
            <option v-for="(user, index) in users" :value="user" :key="index">
              {{ user }}
            </option>
          </select></label
        >
      </div>

      <ul class="todo-list">
        <li v-for="todo in filteredTodos" :key="todo.id">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            class="todo-icon"
            @click="addToFavorites(todo)"
          >
            <!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) -->
            <path
              :style="[
                favorites && favorites.includes(todo.id)
                  ? { fill: 'orange' }
                  : {},
              ]"
              d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"
            />
          </svg>
          {{ todo.title }}
        </li>
      </ul>

      <nav>
        <ul class="pagination">
          <li
            class="page-item"
            :class="{ active: page === currentPage }"
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
          >
            <a class="page-link">{{ page }}</a>
          </li>
        </ul>
      </nav>
    </div>
    <LoaderComponent ref="spinner" />
    <NotificationComponent
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="closeNotification"
      :closeAfter="4000"
    />
  </div>
</template>

<script>
import Vue from "vue";
import LogoutComponent from "@/components/LogoutComponent.vue"; // @ is an alias to /src
import NotificationComponent from "@/components/services/NotificationComponent.vue";
import LoaderComponent from "@/components/services/LoaderComponent.vue";

export default Vue.extend({
  name: "ProfileComponent",
  components: {
    LogoutComponent,
    NotificationComponent,
    LoaderComponent,
  },
  data() {
    return {
      currentUser: {},
      todos: [],
      users: [],
      newTodo: { userId: 1, title: "", completed: false },
      favorites: [],
      isReady: { userInfo: false, todoInfo: false },
      itemsPerPage: 10,
      currentPage: 1,
      totalPages: 1,
      filter: {
        search: "",
        statusFilter: "all",
        userFilter: "all",
      },
      showNotification: false,
      notificationMessage: "",
      notificationType: "",
    };
  },
  watch: {
    filter: {
      handler: function () {
        if (this.totalPages > 0) {
          this.currentPage = 1;
        }
      },
      deep: true,
    },
    isReady: {
      handler: function () {
        if (this.isReady.userInfo && this.isReady.todoInfo) {
          this.$refs.spinner.hideLoader();
        }
      },
      deep: true,
    },
  },
  created() {
    this.fetchUserData();
    this.fetchData();
    this.getFavorite();
  },
  mounted() {
    this.$refs.spinner.showLoader();
  },
  computed: {
    filteredTodos() {
      const status = this.filter.statusFilter;
      const user = this.filter.userFilter;
      const search = this.filter.search.toLowerCase();
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const result = this.todos.filter((todo) => {
        return (
          (status === "all" ||
            (status === "completed" && todo.completed) ||
            (status === "uncompleted" && !todo.completed) ||
            (status === "favorites" && this.favorites.includes(todo.id))) &&
          (user === "all" || user === todo.userId) &&
          (search === "" || todo.title.toLowerCase().includes(search))
        );
      });
      this.getTotalPages(result);
      return result.slice(start, end);
    },
  },
  methods: {
    async fetchData() {
      return fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "GET",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.todos = data;
          this.users = Array.from(
            new Set(this.todos.map((todo) => todo.userId))
          );
          this.isReady.todoInfo = true;
        });
    },
    getTotalPages(val) {
      this.totalPages = Math.ceil(val.length / this.itemsPerPage);
    },
    async fetchUserData() {
      return fetch(
        `https://jsonplaceholder.typicode.com/users/${JSON.parse(
          localStorage.getItem("nux-game-uid")
        )}`,
        {
          method: "GET",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.currentUser = data;
          this.isReady.userInfo = true;
        });
    },
    addTodo() {
      // Implement logic to add a new todo to the API
      // After successful addition, refresh the todo list by calling this.fetchData()
      fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.newTodo.userId,
          title: this.newTodo.title,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          this.todos.unshift(res);
          this.showSuccessNotification();
        });
    },
    addToFavorites(todo) {
      // Implement logic to add a todo to favorites
      if (this.favorites && this.favorites.includes(todo.id)) {
        this.favorites.splice(this.favorites.indexOf(todo.id), 1);
        this.showInfoNotification("Todo item has been removed from favorites");
      } else {
        console.log(this.favorites);
        this.favorites.push(todo.id);
        this.showInfoNotification("Todo item has been added to favorites");
      }
      // Save favorites to localStorage
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
      this.getFavorite();
    },
    changePage(page) {
      this.currentPage = page;
    },
    getFavorite() {
      if (JSON.parse(localStorage.getItem("favorites") !== null)) {
        this.favorites = JSON.parse(localStorage.getItem("favorites"));
      }
    },
    showSuccessNotification() {
      this.notificationMessage = "Todo item has been added to list";
      this.notificationType = "success";
      this.showNotification = true;
    },
    showInfoNotification(message) {
      this.notificationMessage = message;
      this.notificationType = "info";
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
.profile {
  padding-top: 15px;
}
.profile-info,
.create-todo {
  background-color: var(--grey-300);
  border: 2px solid var(--grey-400);
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  min-width: 300px;
  &-container {
    display: flex;
    align-items: flex-start;
    gap: 30px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }
  .form-label {
    width: 100%;
    text-align: left;
    margin-bottom: 10px;
    &:last-of-type {
      margin-bottom: 20px;
    }
    input {
      width: 100%;
      border-radius: 5px;
      background-color: #fff;
      color: rgb(26, 26, 26);
      border: none;
      height: 28px;
      font-size: 14px;
      padding: 10px;
      margin-top: 5px;
    }
  }

  button {
    margin-left: auto;
    background-color: var(--success-color);
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    min-width: 80px;
    &:disabled {
      cursor: default;
      background-color: #a5d6a7;
      color: #eeeeee;
    }
  }
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 30px;
  width: 100%;
  padding: 15px 8px;
  border-radius: 8px;
  background-color: var(--grey-300);
  label,
  input {
    display: inline-block;
  }
}

.todo {
  &-icon {
    cursor: pointer;
    width: 15px;
    height: 15px;
  }
  &-list {
    color: var(--grey-300);
    text-align: left;
    padding-left: 0;
    margin-bottom: 30px;
    li {
      display: flex;
      align-items: center;
      gap: 10px;
      &:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }
  }
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  list-style: none;
  li {
    background-color: var(--grey-300);
    padding: 5px;
    min-width: 30px;
    cursor: pointer;
  }
  .active {
    background-color: var(--success-color);
    color: #fff;
  }
}

ul {
  list-style: none;
}

h1 {
  text-align: center;
  color: #333;
}

h2 {
  color: #333;
  margin: 10px 0;
}

p {
  color: #555;
  margin: 5px 0;
}

h3 {
  color: #333;
  margin-top: 10px;
}
</style>
