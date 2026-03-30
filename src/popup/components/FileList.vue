<script setup lang="ts">
defineProps<{ files: File[] }>()
defineEmits<{ 'remove-file': [index: number] }>()

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<template>
  <ul v-if="files.length" class="list">
    <li v-for="(file, i) in files" :key="`${file.name}-${i}`" class="item">
      <span class="name" :title="file.name">{{ file.name }}</span>
      <span class="size">{{ formatSize(file.size) }}</span>
      <button class="remove" aria-label="`Remove ${file.name}`" @click="$emit('remove-file', i)">✕</button>
    </li>
  </ul>
</template>

<style scoped>
.list {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 140px;
  overflow-y: auto;
}
.item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  font-size: 12px;
}
.name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #374151;
}
.size {
  color: #9ca3af;
  flex-shrink: 0;
}
.remove {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0;
  font-size: 11px;
  flex-shrink: 0;
  line-height: 1;
}
.remove:hover {
  color: #ef4444;
}
</style>
