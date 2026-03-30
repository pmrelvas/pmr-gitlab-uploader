import { ref, readonly } from 'vue'
import type { GitLabConfig } from '../types'

const STORAGE_KEY = 'gitlab_config'

const defaultConfig: GitLabConfig = {
  host: 'https://gitlab.com',
  token: '',
  owner: '',
  repo: '',
  targetPath: '',
  defaultBranch: 'main',
}

export function useConfig() {
  const config = ref<GitLabConfig>({ ...defaultConfig })

  async function loadConfig(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(STORAGE_KEY, (result) => {
        if (result[STORAGE_KEY]) {
          config.value = { ...defaultConfig, ...result[STORAGE_KEY] }
        }
        resolve()
      })
    })
  }

  async function saveConfig(newConfig: GitLabConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [STORAGE_KEY]: newConfig }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          config.value = { ...newConfig }
          resolve()
        }
      })
    })
  }

  return { config: readonly(config), loadConfig, saveConfig }
}
