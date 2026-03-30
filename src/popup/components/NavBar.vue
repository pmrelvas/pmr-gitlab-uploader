<script setup lang="ts">
defineProps<{ activeTab: 'upload' | 'settings' }>()
defineEmits<{ 'update:activeTab': ['upload' | 'settings'] }>()
</script>

<template>
  <nav class="nav">
    <button
      :class="['tab', { active: activeTab === 'upload' }]"
      @click="$emit('update:activeTab', 'upload')"
    >
      Upload
    </button>
    <button
      :class="['tab', { active: activeTab === 'settings' }]"
      @click="$emit('update:activeTab', 'settings')"
    >
      Settings
    </button>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 16px;
}
.tab {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  transition: color 0.15s, border-color 0.15s;
}
.tab:hover {
  color: #374151;
}
.tab.active {
  color: #fc6d26;
  border-bottom-color: #fc6d26;
}
</style>
