<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import SignInWithSui from './components/SignInWithSui.vue';
</script>

<template>
  <nav>
    <div>
      <RouterLink to="/" exact>Home</RouterLink>
      <RouterLink to="/doc" exact>➕ New Document</RouterLink>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
      <text x="0" y="40" font-family="Inter, sans-serif" font-size="36" font-weight="600">
        <tspan fill="#4DA2FF">Sui</tspan>
        <tspan fill="#011829"> Office</tspan>
      </text>
    </svg>

    <div>
      <SignInWithSui />
    </div>
  </nav>
  <RouterView />
</template>

<style scoped></style>
