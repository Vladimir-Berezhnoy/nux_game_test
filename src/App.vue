<template>
  <div id="app" class="app">
    <header class="app-header">
    </header>
    <main class="app-main">
      <router-view />
    </main>
    <footer class="app-footer"></footer>
  </div>
</template>

<style lang="scss">
@import './assets/styles/main.scss';

.app {
  display: flex;
  flex-direction: column;
  &-header {
    height: 60px;
    background-color: var(--grey-800);;
  }
  &-main {
    background-color: var(--grey-700);;
    min-height: calc(100vh - 60px - 160px);
  }
  &-footer {
    background-color: var(--grey-800);;
    height: 160px;
  }
}


</style>
