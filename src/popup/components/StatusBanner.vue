<script setup lang="ts">
import { watch } from 'vue'
import type { StatusMessage } from '../types'

const props = defineProps<{ status: StatusMessage }>()
const emit = defineEmits<{ dismiss: [] }>()

watch(
  () => props.status.type,
  (type) => {
    if (!type) return
    const timer = setTimeout(() => emit('dismiss'), 4000)
    return () => clearTimeout(timer)
  },
)
</script>

<template>
  <div v-if="status.type" :class="['banner', status.type]" role="alert">
    <span>{{ status.text }}</span>
    <button class="close" aria-label="Dismiss" @click="$emit('dismiss')">✕</button>
  </div>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  font-size: 13px;
  line-height: 1.4;
  border-radius: 6px;
  margin-bottom: 12px;
}
.banner.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}
.banner.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
.close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  color: inherit;
  opacity: 0.7;
  flex-shrink: 0;
}
.close:hover {
  opacity: 1;
}
</style>
