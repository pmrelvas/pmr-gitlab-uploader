<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import UploadView from './components/UploadView.vue'
import SettingsView from './components/SettingsView.vue'
import StatusBanner from './components/StatusBanner.vue'
import type { StatusMessage } from './types'

const activeTab = ref<'upload' | 'settings'>('upload')
const status = ref<StatusMessage>({ text: '', type: null })

function onStatus(msg: StatusMessage) {
  status.value = msg
}

function dismissStatus() {
  status.value = { text: '', type: null }
}
</script>

<template>
  <div class="app">
    <header class="header">
      <img src="/icons/icon48.png" alt="" width="20" height="20" />
      <span class="title">PMR GitLab Uploader</span>
    </header>

    <main class="main">
      <StatusBanner :status="status" @dismiss="dismissStatus" />
      <NavBar :active-tab="activeTab" @update:active-tab="activeTab = $event" />
      <UploadView v-if="activeTab === 'upload'" @status="onStatus" />
      <SettingsView v-else @status="onStatus" />
    </main>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  width: 380px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #fff;
  color: #111827;
}

#app {
  min-height: 200px;
}
</style>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px 0;
}
.title {
  font-size: 14px;
  font-weight: 700;
  color: #fc6d26;
}
.main {
  padding: 12px 16px 16px;
}
</style>
