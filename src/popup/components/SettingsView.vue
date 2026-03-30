<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfig } from '../composables/useConfig'
import type { GitLabConfig, StatusMessage } from '../types'

const emit = defineEmits<{ status: [msg: StatusMessage] }>()

const { loadConfig, saveConfig } = useConfig()
const saving = ref(false)

const form = ref<GitLabConfig>({
  host: 'https://gitlab.com',
  token: '',
  owner: '',
  repo: '',
  targetPath: '',
  defaultBranch: 'main',
})

onMounted(async () => {
  const { config } = useConfig()
  await loadConfig()
  form.value = { ...config.value }
})

async function save() {
  if (!form.value.host.trim()) {
    emit('status', { text: 'GitLab host URL is required.', type: 'error' })
    return
  }
  if (!form.value.repo.trim()) {
    emit('status', { text: 'Repository name is required.', type: 'error' })
    return
  }
  if (!form.value.token.trim()) {
    emit('status', { text: 'Access token is required.', type: 'error' })
    return
  }

  saving.value = true
  try {
    await saveConfig(form.value)
    emit('status', { text: 'Settings saved.', type: 'success' })
  } catch (err) {
    emit('status', {
      text: err instanceof Error ? err.message : 'Failed to save settings.',
      type: 'error',
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="settings" @submit.prevent="save">
    <div class="field">
      <label for="host">GitLab host URL <span class="req">*</span></label>
      <input
        id="host"
        v-model="form.host"
        type="url"
        placeholder="https://gitlab.com"
        required
      />
    </div>

    <div class="field">
      <label for="owner">Repository owner / namespace</label>
      <input
        id="owner"
        v-model="form.owner"
        type="text"
        placeholder="my-group (leave empty for personal)"
      />
    </div>

    <div class="field">
      <label for="repo">Repository name <span class="req">*</span></label>
      <input id="repo" v-model="form.repo" type="text" placeholder="my-repo" required />
    </div>

    <div class="field">
      <label for="path">Target folder path in repo</label>
      <input id="path" v-model="form.targetPath" type="text" placeholder="uploads/docs" />
    </div>

    <div class="field">
      <label for="branch-default">Default branch</label>
      <input id="branch-default" v-model="form.defaultBranch" type="text" placeholder="main" />
    </div>

    <div class="field">
      <label for="token">Access token <span class="req">*</span></label>
      <input
        id="token"
        v-model="form.token"
        type="password"
        placeholder="glpat-xxxxxxxxxxxxxxxxxxxx"
        required
        autocomplete="current-password"
      />
      <p class="hint">Token needs at least <code>api</code> scope.</p>
    </div>

    <button class="btn-primary" type="submit" :disabled="saving">
      {{ saving ? 'Saving…' : 'Save settings' }}
    </button>
  </form>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
label {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
}
.req {
  color: #ef4444;
}
input {
  padding: 7px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}
input:focus {
  border-color: #fc6d26;
}
.hint {
  margin: 2px 0 0;
  font-size: 11px;
  color: #9ca3af;
}
.hint code {
  background: #f3f4f6;
  padding: 1px 4px;
  border-radius: 3px;
}
.btn-primary {
  width: 100%;
  padding: 9px;
  background: #fc6d26;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}
.btn-primary:hover:not(:disabled) {
  background: #e8601f;
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
