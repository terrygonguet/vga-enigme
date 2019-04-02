<template>
  <div id="app" class="h-screen">
    <nav class="flex flex-col border-r border-black">
      <router-link to="/" class="p-4 border-b border-black">🔒</router-link>
      <router-link to="/math" class="p-4 border-b border-black">🔢</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style>
#app {
  display: grid;
  grid-template-columns: auto 1fr;
}
</style>
