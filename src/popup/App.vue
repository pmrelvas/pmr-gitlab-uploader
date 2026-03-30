<script setup lang="ts">
import { ref } from 'vue'
import type { StatusMessage } from './types'

const activeTab = ref<'upload' | 'settings'>('upload')
const status = ref<StatusMessage>({ text: '', type: null })

</script>

<template>
  <div class="app">
    <header class="header">
      <span class="title">PMR GitLab Uploader</span>
    </header>

    <main class="main">

    </main>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
