<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DropZone from './DropZone.vue'
import FileList from './FileList.vue'
import { useConfig } from '../composables/useConfig'
import { useFileReader } from '../composables/useFileReader'
import { useGitLab } from '../composables/useGitLab'
import type { StatusMessage } from '../types'

const emit = defineEmits<{ status: [msg: StatusMessage] }>()

const { config, loadConfig } = useConfig()
const { encodeFiles } = useFileReader()
const { uploadFiles } = useGitLab()

const files = ref<File[]>([])
const commitMessage = ref('')
const branch = ref('main')
const overwrite = ref(false)
const loading = ref(false)

onMounted(async () => {
  await loadConfig()
  branch.value = config.value.defaultBranch || 'main'
})

function onFilesAdded(added: File[]) {
  // avoid duplicate names
  const existing = new Set(files.value.map((f) => f.name))
  files.value.push(...added.filter((f) => !existing.has(f.name)))
}

function removeFile(index: number) {
  files.value.splice(index, 1)
}

async function push() {
  if (!files.value.length) return
  if (!commitMessage.value.trim()) {
    emit('status', { text: 'Commit message is required.', type: 'error' })
    return
  }
  if (!config.value.repo) {
    emit('status', { text: 'No repository configured. Go to Settings first.', type: 'error' })
    return
  }

  loading.value = true
  try {
    const encoded = await encodeFiles(files.value, config.value.targetPath)
    await uploadFiles(config.value, encoded, branch.value, commitMessage.value, overwrite.value)
    emit('status', {
      text: `${files.value.length} file(s) committed to ${branch.value}.`,
      type: 'success',
    })
    files.value = []
    commitMessage.value = ''
  } catch (err) {
    emit('status', {
      text: err instanceof Error ? err.message : 'Upload failed.',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="upload">
    <DropZone @files-added="onFilesAdded" />
    <FileList :files="files" @remove-file="removeFile" />

    <div class="field">
      <label for="commit-msg">Commit message</label>
      <textarea
        id="commit-msg"
        v-model="commitMessage"
        rows="2"
        placeholder="Add files via GitLab Uploader"
      />
    </div>

    <div class="field">
      <label for="branch">Branch</label>
      <input id="branch" v-model="branch" type="text" placeholder="main" />
    </div>

    <div class="check-row">
      <label class="check-label">
        <input v-model="overwrite" type="checkbox" />
        Overwrite existing files
      </label>
    </div>

    <button class="btn-primary" :disabled="loading || !files.length" @click="push">
      <span v-if="loading">Pushing…</span>
      <span v-else>Push to GitLab</span>
    </button>
  </div>
</template>

<style scoped>
.upload {
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
textarea,
input[type='text'] {
  padding: 7px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
}
textarea:focus,
input[type='text']:focus {
  border-color: #fc6d26;
}
.check-row {
  display: flex;
  align-items: center;
}
.check-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  cursor: pointer;
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
