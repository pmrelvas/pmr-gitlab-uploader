<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ 'files-added': [files: File[]] }>()
const isDragOver = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function onDrop(e: DragEvent) {
  isDragOver.value = false
  const files = Array.from(e.dataTransfer?.files ?? [])
  if (files.length) emit('files-added', files)
}

function onInputChange(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  if (files.length) emit('files-added', files)
  // reset so same file can be re-added
  if (inputRef.value) inputRef.value.value = ''
}
</script>

<template>
  <div
    :class="['dropzone', { over: isDragOver }]"
    role="button"
    tabindex="0"
    aria-label="Drop files here or click to browse"
    @dragover.prevent="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop.prevent="onDrop"
    @click="inputRef?.click()"
    @keydown.enter="inputRef?.click()"
    @keydown.space.prevent="inputRef?.click()"
  >
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 16V4m0 0L8 8m4-4 4 4" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke-linecap="round" />
    </svg>
    <p class="label">Drop files here</p>
    <p class="sub">or click to browse</p>
    <input ref="inputRef" type="file" multiple hidden @change="onInputChange" />
  </div>
</template>

<style scoped>
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 24px 16px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  color: #9ca3af;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  outline: none;
}
.dropzone:hover,
.dropzone:focus-visible {
  border-color: #fc6d26;
  color: #fc6d26;
  background: #fff7f3;
}
.dropzone.over {
  border-color: #fc6d26;
  color: #fc6d26;
  background: #fff7f3;
}
.label {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 500;
}
.sub {
  margin: 0;
  font-size: 11px;
}
</style>
