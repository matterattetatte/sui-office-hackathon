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
    <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="200" y2="200">
          <stop offset="0%" stop-color="#22D3EE" />
          <stop offset="100%" stop-color="#4A47F5" />
        </linearGradient>
      </defs>
      <!-- Document shape -->
      <rect x="40" y="30" width="120" height="140" rx="10" stroke="url(#grad1)" stroke-width="12" />
      <!-- Node network -->
      <circle cx="80" cy="70" r="8" fill="url(#grad1)" />
      <circle cx="120" cy="90" r="8" fill="url(#grad1)" />
      <circle cx="100" cy="130" r="8" fill="url(#grad1)" />
      <line x1="80" y1="70" x2="120" y2="90" stroke="url(#grad1)" stroke-width="6" stroke-linecap="round" />
      <line x1="120" y1="90" x2="100" y2="130" stroke="url(#grad1)" stroke-width="6" stroke-linecap="round" />
      <line x1="100" y1="130" x2="80" y2="70" stroke="url(#grad1)" stroke-width="6" stroke-linecap="round" />
    </svg>
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
